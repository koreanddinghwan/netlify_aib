import { MaxHeap } from "./maxheap.js";
import { convertr } from "./encoder.js";

const text = document.getElementById("text");
const speakBtn = document.getElementById("speak-btn");
const resetBtn = document.getElementById("reset-btn");
const startBtn = document.getElementById("start-btn");
const tmpContainer = document.getElementById("tmp-container");
const wordBtn = document.getElementById("word-btn");
const captureBtn = document.getElementById("capture-btn");
const audioBtn = document.getElementById("audio-btn");

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/u67KW-Ijyx/";

let model, webcam, labelContainer, maxPredictions;
const maxheap = new MaxHeap();

startBtn.addEventListener("click", init);

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

/**
 * speakEvent
 * */
const speakEvent = async () => {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = "ko-KR";
  speech.text = text.value;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 2;
  window.speechSynthesis.speak(speech);
};

speakBtn.addEventListener("click", speakEvent);

/**
 * resetEvent
 * */
const resetEvent = async () => {
  text.value = "";
  maxheap.clear();
};
resetBtn.addEventListener("click", resetEvent);

/**
 * capture지문자
 * */
const capture = async () => {
  const prediction = await model.predict(webcam.canvas);
  const maxProbabilityElement = prediction.reduce((max, current) => {
    // 현재 객체의 probability가 현재 최대값보다 크면 현재 객체로 교체합니다.
    if (current.probability.toFixed(2) > max.probability.toFixed(2)) {
      return current;
    } else {
      return max;
    }
  }, prediction[0]);
  tmpContainer.value += maxProbabilityElement.className;
};
captureBtn.addEventListener("click", capture);

const makeWord = async () => {
  var hangeul = convertr(tmpContainer.value);
  tmpContainer.value = "";
  text.value += hangeul;
};
wordBtn.addEventListener("click", makeWord);

const runAudioFile = async () => {
  for (let i = 0; i < text.value.length; i++) {
    const hangeul = text.value[i];
    var audio = new Audio(`audio/${hangeul}.mp3`);
    audio.play();
    time.sleep(1);
  }
};
audioBtn.addEventListener("click", runAudioFile);

