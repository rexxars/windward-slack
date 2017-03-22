# windward-slack

Monitors a [Windward](http://store.steampowered.com/app/326410/) server and notifies a slack channel when someone enters or exits the game.

## Setup

```
git clone https://github.com/rexxars/windward-slack.git
cd windward-slack
npm install
npm start
```

## Environment variables

Note that these can also be set in a `.env` file in the app folder.

- `SLACK_WEBHOOK_URL` - Incoming webhook URL for your slack. Starts with `https://hooks.slack.com`
- `SLACK_CHANNEL` - Channel to post notifications to. Defaults to `#windward`
- `SLACK_USERNAME` - Username to use when posting notifications. Defaults to `Windward`
- `SLACK_ICON_URL` - Icon URL to use for the user that posts the notifications
- `WINDWARD_SERVER_URL` - Server URL. If your windward server is at `somehost.com:5127`, use `http://somehost.com:5127/`.

## License

MIT-licensed. See LICENSE.
