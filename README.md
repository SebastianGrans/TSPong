# Pong with TypeScript

I want to learn the basics of TypeScript by creating a simple Pong game.

## Chunks

* How do I compile TypeScript?
* How can I draw a rectangle (the paddle) on a canvas?
* How can I move the paddle on a canvas?
* How can I detect a collision between a rectangle and the canvas border?
* How can I detect a collision between the ball and the paddles?

## `<canvas>`

The Canvas API allows us to draw things.
[mdn - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

The size of the canvas does not match the size that is specified by CSS. This will result in strange behavior.

## How do I compile TypeScript?

It's pretty straight forward, and is well documented on VS Code's [documentation page](https://code.visualstudio.com/docs/typescript/typescript-compiling).

After installing `Node.js` and `typescript` you can run:

```bash
tsc script.ts
```

Which will yield a `script.js` in the same folder.

*Note:* If you install it while you have VS Code open, you might have to restart VS Code for the `tsc` command to
exist in the integrated terminal.

This gets old quickly, but luckily VS Code comes with a predefined task that will automatically
compile on save. It's described
[here](https://code.visualstudio.com/docs/typescript/typescript-compiling#_step-2-run-the-typescript-build)
on the same page.

1. `Ctrl+Shift+B`
2. Choose `tsc: watch - tsconfig.json`

## How do I draw a rectangle?

This is also quite simple.

```typescript
ctx.fillStyle = "red";
ctx.fillRect(x, y, width, height);
```

## How do I move a rectangle?

You can't really move an object after it's been drawn. Instead you have to clear the screen,
and then draw the object at it's new location.

```typescript
ctx.clearRect(0, 0, canvasWidth, canvasHeight);
ctx.fillStyle = "red";
ctx.fillRect(newx, newy, width, height);
```

## What can I do with `tsconfig.json`?

It seems like VS Code automatially created a `tsconfig.json` file for me. It contains a lot of
fields that are commented out. It also links to a page: <https://www.typescriptlang.org/tsconfig/>

I decided to enable all type checks.

## Improvements

* Shoot the ball in a random direction
* Where the ball hits the paddle should alter its bounce direction
* Less naive implementation of paddle collision
* Place origin at `(width / 2, 0)`
  * This could probably help simplify the code of ball-paddle collisions, since the calulations would be "symmetrical"
* Make the paddle origin be on the middle front instead of in the middle of the rectangle
* Add a bot
