function handleTaskCommand(ctx) {
  return ctx.scene.enter("createTask");
}

function handleMyTasksCommand(ctx) {
  return ctx.scene.enter("myTasks");
}

export { handleTaskCommand, handleMyTasksCommand };
