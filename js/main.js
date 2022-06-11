// Unix timestamp (in seconds) to count down to
var twoDaysFromNow = new Date().getTime() / 1000 + 86400 * 0.5 + 1;

const eventStart = Math.round(+new Date(2022, 10, 15, 16) / 1000); // 15th October 2022 at 4 pm in seconds

// Set up FlipDown
const flipdown = new FlipDown(eventStart, {
  headings: ["Dani", "Sati", "Minute", "Sekunde"],
});

// Start the countdown
flipdown.start();

// Do something when the countdown ends
flipdown.ifEnded(() => {
  console.log("The countdown has ended!");
});
