import { lyrics } from "./lyrics.js";

const audio = document.getElementById("audio");
const playButton = document.getElementById("play-button");
const lyricDisplay = document.getElementById("lyric-display");
const seekSlider = document.getElementById("seek-slider");

let index = 0;

// Create snowflakes effect
function createSnowflakes() {
    const snowflakeCount = 50;
    const snowflakes = [];
    const container = document.body;

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.style.position = "absolute";
        snowflake.style.top = `${Math.random() * 100}%`;
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.fontSize = `${Math.random() * 15 + 10}px`;
        snowflake.style.opacity = Math.random();
        snowflake.textContent = "❄️";
        snowflakes.push(snowflake);
        container.appendChild(snowflake);

        // Animation for snowflakes
        gsap.to(snowflake, {
            y: "100vh",
            rotation: "+=360",
            repeat: -1,
            yoyo: true,
            duration: Math.random() * 6 + 5,
            delay: Math.random(),
            ease: "linear"
        });
    }
}

createSnowflakes();

// Sync lyrics with GSAP animations
function updateLyrics() {
    const previousLyric = lyrics[index - 1]?.text || "";
    const currentLyric = lyrics[index]?.text || "";
    const nextLyric = lyrics[index + 1]?.text || "";

    const previousLine = document.getElementById("previous-line");
    const currentLine = document.getElementById("current-line");
    const nextLine = document.getElementById("next-line");

    // Animate lyric changes with a gentle float and sparkle
    gsap.to([previousLine, currentLine, nextLine], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
            previousLine.textContent = previousLyric;
            currentLine.textContent = currentLyric;
            nextLine.textContent = nextLyric;

            gsap.to(currentLine, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scale: 1.2,
                ease: "elastic.out(1, 0.5)",
                onComplete: () => {
                    gsap.to(currentLine, {
                        scale: 1,
                        duration: 0.3,
                        ease: "bounce.out"
                    });
                },
            });

            // Add twinkling effect to current line (lyrics)
            gsap.to(currentLine, {
                textShadow: "0 0 15px #ffcc00, 0 0 30px #ffcc00, 0 0 60px #ffcc00",
                repeat: -1,
                yoyo: true,
                duration: 0.5,
            });

            gsap.to([previousLine, nextLine], {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.1,
            });
        },
    });

    index++;
}

// Sync lyrics with audio time
audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = progress;

    if (index < lyrics.length && audio.currentTime >= lyrics[index].time) {
        updateLyrics();
    }
});

// Set slider max value after audio metadata is loaded
audio.addEventListener("loadedmetadata", () => {
    seekSlider.max = 100;
    seekSlider.value = 0;
});

// Update audio's current time when slider is moved
seekSlider.addEventListener("input", () => {
    const seekTime = (seekSlider.value / 100) * audio.duration;
    audio.currentTime = seekTime;

    const newIndex = lyrics.findIndex((lyric) => lyric.time > seekTime) - 1;
    index = newIndex >= 0 ? newIndex : 0;

    updateDisplayedLyrics();
});

// Display lyrics with animations
function updateDisplayedLyrics() {
    const previousLyric = lyrics[index - 1]?.text || "";
    const currentLyric = lyrics[index]?.text || "";
    const nextLyric = lyrics[index + 1]?.text || "";

    const previousLine = document.getElementById("previous-line");
    const currentLine = document.getElementById("current-line");
    const nextLine = document.getElementById("next-line");

    // Animate lyric changes with floating effect
    gsap.to([previousLine, currentLine, nextLine], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
            previousLine.textContent = previousLyric;
            currentLine.textContent = currentLyric;
            nextLine.textContent = nextLyric;

            gsap.to([previousLine, currentLine, nextLine], {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.1,
            });
        },
    });
}

// Play/Pause button logic with GSAP animations
playButton.addEventListener("click", () => {
    gsap.to(playButton, {
        scale: 1.1,
        duration: 0.2,
        ease: "power1.inOut",
        onComplete: () => {
            gsap.to(playButton, {
                scale: 1,
                duration: 0.2,
            });
        },
    });

    if (audio.paused) {
        audio.play();
        playButton.textContent = "Pause Song";
        syncLyrics();
    } else {
        audio.pause();
        playButton.textContent = "Play Song";
    }
});

// Reset lyrics and slider when audio ends
audio.addEventListener("ended", () => {
    index = 0;
    seekSlider.value = 0;
    document.getElementById("previous-line").textContent = "";
    document.getElementById("current-line").textContent = "Welcome to Carol of the Bells";
    document.getElementById("next-line").textContent = "";
});
