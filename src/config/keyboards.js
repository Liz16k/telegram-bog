import { Markup } from "telegraf";
import { msgs } from "#config/constants.js";

const { MY_SUBS, SUBSCRIBE, UNSUBSCRIBE } = msgs.SUBSCRIPTION_MENU;
const { CAFE, EVENTS, ATTRACTIONS, GEO } = msgs.KEYBOARD;

const sendGeoKeyboard = () =>
  Markup.keyboard([Markup.button.locationRequest(GEO)])
    .resize()
    .oneTime();

const recommendMenuKeyboard = () =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback(CAFE, "CAFE"),
      Markup.button.callback(EVENTS, "EVENTS"),
    ],
    [Markup.button.callback(ATTRACTIONS, "ATTRACTIONS")],
  ])
    .resize()
    .oneTime();

const subMenuKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback(MY_SUBS, "MY_SUBSCRIPTIONS")],
    [
      Markup.button.callback(SUBSCRIBE, "SUBSCRIBE"),
      Markup.button.callback(UNSUBSCRIBE, "UNSUBSCRIBE"),
    ],
  ])
    .resize()
    .oneTime();

const toNotifyKeyboard = () =>
  Markup.inlineKeyboard([
    Markup.button.callback(msgs.KEYBOARD.YES, "REMINDER_YES"),
    Markup.button.callback(msgs.KEYBOARD.NO, "REMINDER_NO"),
  ]);

const chooseIntervalKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback(msgs.KEYBOARD.EVERY_HOUR, "HOURLY")],
    [Markup.button.callback(msgs.KEYBOARD.TWO_HOURLY, "TWO_HOURLY")],
    [Markup.button.callback(msgs.KEYBOARD.FOUR_HOURLY, "FOUR_HOURLY")],
  ]);

const weatherKeyboard = () =>
  Markup.keyboard([
    ["Минск", "Брест", "Витебск"],
    [Markup.button.locationRequest(msgs.KEYBOARD.GEO)],
  ])
    .resize()
    .oneTime();

const userSubsKeyboard = ({ userSubscriptionDoc, extraBtn, btnChar, userId }) =>
  Markup.inlineKeyboard([
    ...userSubscriptionDoc[0].subscriptions.map((sub) => {
      const { lat, lon, city } = sub.location;
      return [
        Markup.button.callback(
          `${sub.location.city} ${btnChar}`,
          JSON.stringify({
            params: lat ? `${lat}&${lon}` : city,
            userId,
          })
        ),
      ];
    }),
    [
      Markup.button.callback(
        extraBtn.text,
        JSON.stringify({ type: extraBtn.data })
      ),
    ],
  ])
    .resize()
    .oneTime();

const tasksToDeleteKeyboard = (tasks, userId) =>
  Markup.inlineKeyboard([
    ...tasks.map((task, i) => [
      Markup.button.callback(
        `${i + 1}. ${task.name} ❌`,
        ["delete", task._id, userId].join("_")
      ),
    ]),
    [Markup.button.callback(msgs.KEYBOARD.EXIT, "exit")],
  ])
    .resize()
    .oneTime();

export {
  sendGeoKeyboard,
  recommendMenuKeyboard,
  subMenuKeyboard,
  toNotifyKeyboard,
  chooseIntervalKeyboard,
  weatherKeyboard,
  userSubsKeyboard,
  tasksToDeleteKeyboard,
};
