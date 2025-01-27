"use client";

// import * as tmPose from "teachablemachine/pose";
import { useState, useEffect, useRef } from "react";
import * as tmPose from "@teachablemachine/pose";

export default function TensorflowModel({ onPrediction }) {
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null); // Using useRef for webcam

  useEffect(() => {
    async function loadModel() {
      const modelURL = "/my-pose-model/model.json";
      const metadataURL = "/my-pose-model/metadata.json";
      const loadedModel = await tmPose.load(modelURL, metadataURL);
      setModel(loadedModel);
    }
    loadModel();
    // console.log("Model loaded");
  }, []);

  useEffect(() => {
    if (!model) return;
    // console.log("🚀 ~ useEffect ~ model:", model);

    const setupWebcam = async () => {
      const size = 200;
      const flip = true;
      const newWebcam = new tmPose.Webcam(size, size, flip);
      await newWebcam.setup();
      await newWebcam.play();
      webcamRef.current = newWebcam; // Set webcamRef to the new webcam

      const canvas = document.getElementById("canvas");
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        newWebcam.canvas = canvas; // Assign DOM canvas to webcam's canvas
      }
      // console.log("🚀 ~ setupWebcam ~ setWebcam:", newWebcam);

      const animationFrame = () => {
        newWebcam.update(); // Update the webcam frame
        predict(); // Make predictions
        window.requestAnimationFrame(animationFrame);
      };
      window.requestAnimationFrame(animationFrame);
    };

    setupWebcam();

    // Cleanup function to stop webcam and cancel animation frame on unmount
    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop(); // Stop webcam streaming
        webcamRef.current.webcam.srcObject = null; // Disconnect the webcam
      }
    };
  }, [model]);

  async function predict() {
    // console.log("🚀 ~ predict ~ webcam:", webcamRef.current, "model:", model);

    if (!webcamRef.current || !model) {
      console.log("Webcam or model not ready yet.");
      return;
    }

    // Prediction #1: Run input through posenet
    const { pose, posenetOutput } = await model.estimatePose(
      webcamRef.current.canvas
    );

    // Prediction #2: Run input through teachable machine classification model
    const predictions = await model.predict(posenetOutput);
    const maxPrediction = predictions.reduce((acc, curr) =>
      acc.probability > curr.probability ? acc : curr
    );

    if (maxPrediction.probability >= 0.99999) {
      // console.log("maxPrediction", maxPrediction);
      onPrediction(maxPrediction);
    } else {
      onPrediction(null);
    }

    // const maxPredictions = prediction.length;
    // for (let i = 0; i < maxPredictions; i++) {
    //   const classPrediction =
    //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    // Update labelContainer or other UI elements if needed
    // console.log("classPrediction", classPrediction);
    // Draw poses on canvas
    drawPose(pose);
  }

  function drawPose(pose) {
    if (webcamRef.current && webcamRef.current.canvas) {
      const ctx = webcamRef.current.canvas.getContext("2d");
      ctx.clearRect(
        0,
        0,
        webcamRef.current.canvas.width,
        webcamRef.current.canvas.height
      ); // Clear previous drawings
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      }
    }
  }

  return (
    <div className="bg-black">
      <canvas id="canvas"></canvas>
    </div>
  );
}
