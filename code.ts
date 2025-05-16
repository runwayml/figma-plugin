// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Uncomment the following to use this for local dev mode.
// figma.showUI(__html__, {
//   width: 480,
//   height: 800,
// });

// IMPORTANT: Update the URL to your own hosted service, and then add the domain to the allowlist on corsfix.
figma.showUI(
  `<script>window.location.href="https://<YOUR_REPO_NAME>.github.io/figma-plugin?${Math.random()}";</script>`,
  {
    width: 480,
    height: 800,
  }
);

// Notify UI of initial selection
figma.ui.postMessage({
  type: "selection-changed",
  hasValidFrame:
    figma.currentPage.selection.length === 1 &&
    figma.currentPage.selection[0].type === "FRAME",
});

async function getBase64Images(selection: readonly SceneNode[]) {
  const base64Images = [];
  for (const node of selection) {
    // Convert frame to base64
    const image = await node.exportAsync({
      format: "JPG",
      constraint: { type: "SCALE", value: 1 },
    });

    const base64 = figma.base64Encode(image);
    base64Images.push(`data:image/jpeg;base64,${base64}`);
  }
  return base64Images;
}

// Listen for selection changes
figma.on("selectionchange", async () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: "selection-changed",
      hasValidFrame: false,
      error: "Please select a frame",
    });
    return;
  }

  if (selection.length > 3) {
    figma.ui.postMessage({
      type: "selection-changed",
      hasValidFrame: false,
      error: "Please select not more than 3 frames",
    });
    return;
  }

  if (selection.find((node) => node.type !== "FRAME")) {
    figma.ui.postMessage({
      type: "selection-changed",
      hasValidFrame: false,
      error: "Please select only frames",
    });
    return;
  }

  const base64Images = await getBase64Images(selection);

  figma.ui.postMessage({
    type: "selection-changed",
    imageData: base64Images,
    hasValidFrame: true,
  });
});

// Register drop event handler
figma.on("drop", ((event: DropEvent): boolean => {
  const { items } = event;
  if (items.length > 0) {
    // Look for image data in the dropped items
    const imageItem = items.find((item) => item.type === "text/uri-list");
    if (!imageItem) return false;

    // Create image from the URL
    fetch(imageItem.data)
      .then((response) => response.arrayBuffer())
      .then((imageData) => {
        const image = figma.createImage(new Uint8Array(imageData));

        // Create a rectangle to hold the image
        const rect = figma.createRectangle();
        rect.fills = [
          {
            type: "IMAGE",
            scaleMode: "FILL",
            imageHash: image.hash,
          },
        ];

        // Set size based on image dimensions
        image.getSizeAsync().then(({ width, height }) => {
          rect.resize(width, height);

          // Position the rectangle at the drop coordinates
          rect.x = event.x;
          rect.y = event.y;

          // Select the new rectangle
          figma.currentPage.selection = [rect];

          figma.notify("Image added to canvas! 🎉");
        });
      })
      .catch((error) => {
        figma.notify("Failed to create image: " + error.message, {
          error: true,
        });
      });

    return true; // Return true to indicate we handled the drop
  }
  return false;
}) as (event: DropEvent) => boolean);

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "save-api-key") {
    await figma.clientStorage.setAsync("runway-api-key", msg.apiKey);
    figma.ui.postMessage({ type: "api-key-saved" });
  } else if (msg.type === "get-api-key") {
    const apiKey = await figma.clientStorage.getAsync("runway-api-key");
    figma.ui.postMessage({ type: "api-key-loaded", apiKey });
  } else if (msg.type === "create-image") {
    try {
      // Create image from the URL
      const response = await fetch(msg.imageUrl);
      const imageData = await response.arrayBuffer();
      const image = figma.createImage(new Uint8Array(imageData));

      // Create a rectangle to hold the image
      const rect = figma.createRectangle();
      rect.fills = [
        {
          type: "IMAGE",
          scaleMode: "FILL",
          imageHash: image.hash,
        },
      ];

      // Set size based on image dimensions
      const { width, height } = await image.getSizeAsync();
      rect.resize(width, height);

      // Position the rectangle at the center of the viewport
      const viewport = figma.viewport.center;
      rect.x = viewport.x - width / 2;
      rect.y = viewport.y - height / 2;

      // Select the new rectangle
      figma.currentPage.selection = [rect];
      figma.viewport.scrollAndZoomIntoView([rect]);

      figma.notify("Image added to canvas! 🎉");
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      figma.notify("Failed to create image: " + errorMessage, { error: true });
    }
  } else if (msg.type === "generate-video") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
      figma.ui.postMessage({
        type: "error",
        error: "Please select exactly one frame",
      });
      return;
    }

    const node = selection[0];
    if (node.type !== "FRAME") {
      figma.ui.postMessage({
        type: "error",
        error: "Please select a frame",
      });
      return;
    }
    const isLandscape = node.width > node.height;
    const isSquare = node.width === node.height;

    // Convert frame to base64
    const image = await node.exportAsync({
      format: "JPG",
      constraint: { type: "SCALE", value: 1 },
    });

    const base64 = figma.base64Encode(image);
    figma.ui.postMessage({
      type: "start-video-generation",
      imageData: `data:image/jpeg;base64,${base64}`,
      aspectRatio: isSquare ? "960:960" : isLandscape ? "1280:720" : "720:1280",
    });
  } else if (msg.type === "video-ready") {
    figma.notify("Video generated! 🎉");
  } else if (msg.type === "generate-image") {
    const selection = figma.currentPage.selection;
    const base64Images = await getBase64Images(selection);
    // check aspect ratio of base64Images and make sure they are between 0.5 and 2. If not, resize them to the closest aspect ratio proportional to the original size

    figma.ui.postMessage({
      type: "start-image-generation",
      imageData: base64Images,
    });
  } else if (msg.type === "image-ready") {
    figma.notify("Image generated! 🎉");
  }
};
