import { Scenes, Markup } from "telegraf";
import { saveTaskToDB, fetchUserTasks } from "#services/taskService.js";
import { createTaskScheduler } from "#shedulers/taskSheduler.js";
import { msgs } from "#config/constants.js";
import { toNotifyKeyboard, chooseIntervalKeyboard } from "#config/keyboards.js";

const createTaskScene = new Scenes.WizardScene(
  "createTask",
  (ctx) => {
    ctx.reply(msgs.TASK_START);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.status = "todo";
    const tasks = await fetchUserTasks(ctx.message.from.id);
    const taskName = ctx.message.text;
    ctx.wizard.state.name = taskName;
    if (tasks.filter((task) => task.name === taskName).length) {
      ctx.reply(msgs.ERROR.TASK_EXIST);
      return ctx.scene.leave();
    }
    ctx.reply(msgs.TASK_TONOTIFY, toNotifyKeyboard());
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      ctx.reply(msgs.ERROR.CHOICE);
      return;
    }
    ctx.answerCbQuery(msgs.SUCCESS.TASK_HINT);
    const userId = await ctx.update.callback_query.from.id;
    if (ctx.callbackQuery.data === "REMINDER_YES") {
      ctx.wizard.state.reminder = true;
      ctx.reply(msgs.TASK_INTERVAL, chooseIntervalKeyboard());
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
          ctx.reply(msgs.ERROR.TASK_INTERVAL);
          return;
        }
      }
    }
    const sheduler = await createTaskScheduler({ ctx });
    ctx.wizard.state.shedulerId = await sheduler.options.name;
    ctx.wizard.state.initTime = new Date().toLocaleTimeString("it-IT");
    await saveTaskToDB(userId, ctx.wizard.state);

    const { interval, initTime, name } = ctx.wizard.state;
    const time = [...initTime.split(":")];
    const estimatedTime = (new Date().getHours() + interval) % 24;
    const nextNotifyTime = [
      calcNextTime(estimatedTime, interval),
      time[1],
    ].join(":");

    await ctx.reply(msgs.SUCCESS.TASK_CREATE);
    await ctx.replyWithMarkdownV2(
      [msgs.SUCCESS.TASK_INFO, `*${name}*: `].join("\n") + nextNotifyTime
    );

    return ctx.scene.leave();
  }
);

function calcNextTime(estimatedTime, interval) {
  return estimatedTime < 6 || estimatedTime > 22
    ? calcNextTime((estimatedTime + interval) % 24, interval)
    : estimatedTime;
}

export { createTaskScene };
