import { Scenes, Markup } from "telegraf";
import { saveTaskToDB } from "../../services/taskService";
import { createTaskScheduler } from "../../shedulers/shedulers";

const createTaskScene = new Scenes.WizardScene(
  "createTask",
  (ctx) => {
    ctx.reply("Введите задачу:");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.status = "todo";
    ctx.wizard.state.name = ctx.message.text;
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
    const userId = ctx.update.callback_query.from.id;
    if (ctx.callbackQuery.data === "REMINDER_YES") {
      ctx.wizard.state.reminder = true;
      ctx.reply(
        "Как часто вы хотите получать уведомление о задаче? (каждые ... часов):",
        Markup.inlineKeyboard([
          Markup.button.callback("Ежедневно", "DAILY"),
          Markup.button.callback("Каждые 4 часа", "FOUR_HOURLY"),
          Markup.button.callback("Каждый час", "HOURLY"),
        ])
      );
      return ctx.wizard.next();
    } else {
      ctx.wizard.state.reminder = false;
      await saveTaskToDB(userId, ctx.wizard.state);
      ctx.reply("Задача успешно создана!");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const userId = ctx.update.callback_query.from.id;
    let interval;
    switch (ctx.callbackQuery.data) {
      case "DAILY": {
        ctx.wizard.state.interval = 24;
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
        interval = ctx.message.text;
        if (!isNaN(interval)) ctx.wizard.state.interval = interval;
      }
    }

    ctx.wizard.state.shedulerId = createTaskScheduler({ ctx }).options.name;
    await saveTaskToDB(userId, ctx.wizard.state);
    ctx.reply("Задача успешно создана!");

    return ctx.scene.leave();
  }
);

export { createTaskScene };
