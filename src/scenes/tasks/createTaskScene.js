import { Scenes, Markup } from "telegraf";
import { saveTaskToDB, fetchUserTasks } from "#services/taskService.js";
import { createTaskScheduler } from "#shedulers/taskSheduler.js";
import { msgs } from "#config/constants.js";

const createTaskScene = new Scenes.WizardScene(
  "createTask",
  (ctx) => {
    ctx.reply("Введите задачу:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.status = "todo";
    const tasks = await fetchUserTasks(ctx.message.from.id);
    const taskName = ctx.message.text;
    ctx.wizard.state.name = taskName;
    if (tasks.filter((task) => task.name === taskName).length) {
      ctx.reply("Такая задача уже существует.");
      return ctx.scene.leave();
    }
    ctx.reply(
      "Хотите установить напоминание?",
      Markup.inlineKeyboard([
        Markup.button.callback("Да", "REMINDER_YES"),
        Markup.button.callback("Нет", "REMINDER_NO"),
      ])
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      ctx.reply("Сделайте выбор");
      return;
    }
    const userId = await ctx.update.callback_query.from.id;
    if (ctx.callbackQuery.data === "REMINDER_YES") {
      ctx.wizard.state.reminder = true;
      ctx.reply(
        "Как часто вы хотите получать уведомление о задаче?\n(интервал в часах):",
        Markup.inlineKeyboard([
          [Markup.button.callback("Каждый час", "HOURLY")],
          [Markup.button.callback("Каждые 2 часа", "TWO_HOURLY")],
          [Markup.button.callback("Каждые 4 часа", "FOUR_HOURLY")],
        ])
      );
      return ctx.wizard.next();
    } else {
      ctx.wizard.state.reminder = false;
      await saveTaskToDB(userId, ctx.wizard.state);
      ctx.reply(msgs.SUCCESS.TASK_CREATE);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const callbackQuery = ctx.update.callback_query;
    const userId = callbackQuery ? callbackQuery.from.id : ctx.message.from.id;
    switch (callbackQuery?.data) {
      case "TWO_HOURLY": {
        ctx.wizard.state.interval = 2;
        break;
      }
      case "HOURLY": {
        ctx.wizard.state.interval = 1;
        break;
      }
      case "FOUR_HOURLY": {
        ctx.wizard.state.interval = 4;
        break;
      }
      default: {
        let interval = parseInt(ctx.message.text);
        if (!isNaN(interval) && interval > 0 && interval < 13) {
          ctx.wizard.state.interval = interval;
        } else {
          ctx.reply("Введите количество часов от 1 до 12:");
          return;
        }
      }
    }
    const sheduler = await createTaskScheduler({ ctx });
    ctx.wizard.state.shedulerId = await sheduler.options.name;
    ctx.wizard.state.initTime = new Date().toLocaleTimeString("it-IT");
    await saveTaskToDB(userId, ctx.wizard.state);

    const time = [...ctx.wizard.state.initTime.split(":")];
    const nextNotifyTime = [
      new Date().getHours() + ctx.wizard.state.interval,
      time[1],
    ].join(":");
    await ctx.reply(msgs.SUCCESS.TASK_CREATE);
    await ctx.reply(
      `Следующее напоминание о задаче *${ctx.wizard.state.name}* в: ${nextNotifyTime}`
    );
    ctx.answerCbQuery("💤Напоминания не приходят вне промежутка 6-22ч");

    return ctx.scene.leave();
  }
);

export { createTaskScene };
