// Unix timestamp (in seconds) to count down to
const eventStart = Math.round(new Date(2024, 9, 21, 16) / 1000); // 21st October 2024 at 4 pm in seconds

// Set up FlipDown
const flipdown = new FlipDown(eventStart, {
  headings: ["Dani", "Sati", "Minute", "Sekunde"],
});

// Start the countdown
flipdown.start();

// Do something when the countdown ends
flipdown.ifEnded(() => {
  console.log("Event ended!");
});
