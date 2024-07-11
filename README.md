# Monday Popetech Website Info

A web interface that checks for discrepancies between websites added to Popetech and websites added to the USU Websites Monday.com board.

## Installation

1. Clone repository.
2. Run `npm install` in the root directory.
3. Create a `.env` file in the root directory.
4. Add required environment variables to `.env` file.
5. Run `npm run dev`

## How it Works

1. A user navigates to web interface and clicks start sync.
2. A request is sent back to the server.
3. All websites are pulled from Popetech.
4. All websites are pulled from Monday.com.
5. If a link from Popetech is in Monday.com then it is correct otherwise that link is saved in a error list.
6. List of errors is sent back to web interface.
7. List is rendered in a table for easy viewing.

## Environment Variables

### Production

1. `monday_key`: API Token used to authenticate with Monday.com services.
2. `pope_tech_key`: API Token used to authenticate with Popetech services.

### Development

1. `monday_key`: API Token used to authenticate with Monday.com services.
2. `pope_tech_key`: API Token used to authenticate with Popetech services.

### Optional

1. `PORT`: The number that the application will be available on.

## Version

### 2.1.0

All functionality added.
