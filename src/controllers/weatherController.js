function handleWeatherCommand(ctx) {
  return ctx.scene.enter("weather")
}

export default { handleWeatherCommand };
