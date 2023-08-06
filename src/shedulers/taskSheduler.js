import { schedule } from "node-cron";
import { fetchUsersTasks } from "#services/taskService.js";
import { logMsgs, msgs } from "#config/constants";

const createTaskScheduler = ({ ctx, bot, task, userId }) => {
  try {
    task ??= ctx.wizard.state;
    bot ??= ctx.bot;
    userId ??= ctx.update.callback_query.from.id;
    const { name, interval } = task;
    return schedule(
      `0 */${interval} * * *`,
      () => {
        bot.telegram
          .sendMessage(userId, `${msgs.NOTIFY} ${name}`)
          .then(() => {
            console.log(logMsgs.SUCCESS.MSG, "на", userId);
          })
          .catch((error) => {
            console.error(logMsgs.ERROR.MSG, "на", userId, error.message);
          });
      },
      {
        timezone: "Europe/Minsk",
      }
    );
  } catch (error) {
    console.error(logMsgs.ERROR.SHEDULER, error.message);
  }
};

const taskSheduler = async (bot) => {
  try {
    const usersTasks = await fetchUsersTasks();
    usersTasks.forEach(async (user) => {
      const userId = user.userId;
      user.tasks
        .filter((task) => task.reminder)
        .forEach((task) => {
          const shedule = createTaskScheduler({ bot, task, userId });
          task.shedulerId = shedule.options.name;
        });
      await user.save();
    });
  } catch (error) {
    console.erro(logMsgs.ERROR.SHEDULER, error.message);
  }
};

export { taskSheduler, createTaskScheduler };
