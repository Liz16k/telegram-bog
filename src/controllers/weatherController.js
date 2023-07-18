function handleWeatherCommand(ctx) {
  return ctx.scene.enter("weather")
}

module.exports = { handleWeatherCommand };
