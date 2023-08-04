import { schedule } from "node-cron";
import { fetchUsersTasks } from "../services/taskService.js";

const createTaskScheduler = ({ ctx, bot, task, userId }) => {
  task ??= ctx.wizard.state;
  bot ??= ctx.bot;
  userId ??= ctx.update.callback_query.from.id;
  const { name, interval } = task;
  return schedule(
    `0 */${interval} * * *`,
    () => {
      bot.telegram
        .sendMessage(userId, `Пора выполнить задачу: ${name}`)
        .then(() => {
          console.log(`Сообщение успешно отправлено на userId: ${userId}`);
        })
        .catch((error) => {
          console.error(
            `Не удалось отправить сообщение на userId: ${userId}`,
            error.message
          );
        });
    },
    {
      timezone: "Europe/Minsk",
    }
  );
};

const taskSheduler = async (bot) => {
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
};

export { taskSheduler, createTaskScheduler };
