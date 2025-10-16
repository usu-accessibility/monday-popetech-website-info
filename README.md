# Monday Popetech Website Info

[A web interface](https://monday-popetech-website-info.accessapps.link/) that checks for discrepancies between websites added to Popetech and websites added to the [USU Websites Monday.com board](https://usu.monday.com/boards/2929644510). Hosted [on Coolify](https://app.coolify.io/project/dg48408).

## Installation

1. Clone repository.
2. Run `npm install` in the root directory.
3. Create a `.env` file in the root directory, structured like [the env example file](/.env.example), and fill it with the required values.
4. Run `npm run dev` in the root directory.

## How it Works

1. A user navigates to web interface and clicks start sync, which sends a request to the server.
2. All websites are pulled from Popetech.
3. All websites are pulled from Monday.com.
4. If a link from Popetech is in Monday.com then it is correct. Otherwise, that link is saved in a error list.
5. List of errors is sent back to web interface, and rendered in a table for easy viewing.

## Environment Variables
See the [.env.example](/.env.example)

## Version

### 2.1.0

All functionality added.
