import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";

const useLivenessCheck = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(null);
  const [completedInstructions, setCompletedInstructions] = useState([]);
  const [isLivenessVerified, setIsLivenessVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flashing, setFlashing] = useState(false);

  // Movement thresholds
  const nodThreshold = 10;
  const mouthOpenThreshold = 30;
  const eyeClosedThreshold = 10;

  // Refs for flags and counters
  const openMouthDone = useRef(false);
  const blinkDone = useRef(false);
  const blinkStarted = useRef(false);
  const blinkCount = useRef(0);
  const nodDone = useRef(false);
  const initialNoseY = useRef(null);

  const instructions = [
    "Please open your mouth wide.",
    "Please blink your eyes twice.",
    "Please nod your head.",
  ];

  const loadModels = useCallback(async () => {
    setLoading(true);
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    } catch (error) {
      console.error("Error loading models:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const pickRandomInstruction = useCallback(() => {
    const availableInstructions = instructions.filter(
      (_, index) => !completedInstructions.includes(index)
    );

    if (availableInstructions.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * availableInstructions.length
      );
      const chosenInstructionIndex = instructions.indexOf(
        availableInstructions[randomIndex]
      );
      setCurrentInstructionIndex(chosenInstructionIndex);
    } else {
      setIsLivenessVerified(true);
    }
  }, [completedInstructions]);

  const detectFace = useCallback(async () => {
    if (
      videoRef.current &&
      canvasRef.current &&
      currentInstructionIndex !== null
    ) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const canvasCtx = canvasRef.current.getContext("2d");

        const dims = faceapi.matchDimensions(
          canvasRef.current,
          videoRef.current,
          true
        );
        const resizedDetections = faceapi.resizeResults(detections, dims);
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        switch (currentInstructionIndex) {
          case 0:
            // Mouth open detection
            const mouthTop = landmarks.positions[62];
            const mouthBottom = landmarks.positions[66];
            const mouthDistance = mouthBottom.y - mouthTop.y;

            if (mouthDistance > mouthOpenThreshold && !openMouthDone.current) {
              openMouthDone.current = true;
              setCompletedInstructions([...completedInstructions, 0]);
              setCurrentInstructionIndex(null);
            }
            break;

          case 1:
            // Blink detection
            const leftEyeTop = landmarks.positions[37];
            const leftEyeBottom = landmarks.positions[41];
            const rightEyeTop = landmarks.positions[43];
            const rightEyeBottom = landmarks.positions[47];

            const leftEyeDistance = leftEyeBottom.y - leftEyeTop.y;
            const rightEyeDistance = rightEyeBottom.y - rightEyeTop.y;

            if (
              leftEyeDistance < eyeClosedThreshold &&
              rightEyeDistance < eyeClosedThreshold &&
              !blinkStarted.current
            ) {
              blinkStarted.current = true;
              blinkCount.current++;
            } else if (
              leftEyeDistance >= eyeClosedThreshold &&
              rightEyeDistance >= eyeClosedThreshold &&
              blinkStarted.current
            ) {
              blinkStarted.current = false;
            }

            if (blinkCount.current >= 2 && !blinkDone.current) {
              blinkDone.current = true;
              setCompletedInstructions([...completedInstructions, 1]);
              setCurrentInstructionIndex(null);
            }
            break;

          case 2:
            // Nod detection
            const nose = landmarks.positions[30];

            if (initialNoseY.current === null) {
              initialNoseY.current = nose.y;
            } else {
              const verticalMovement = Math.abs(nose.y - initialNoseY.current);

              if (verticalMovement > nodThreshold && !nodDone.current) {
                nodDone.current = true;
                setCompletedInstructions([...completedInstructions, 2]);
                setCurrentInstructionIndex(null);
              }
            }
            break;

          default:
            break;
        }
      }
    }
  }, [currentInstructionIndex]);

  // Effects
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      setLoading(false);
    }
  }, [videoRef, canvasRef]);

  useEffect(() => {
    if (currentInstructionIndex === null) {
      pickRandomInstruction();
    }
  }, [currentInstructionIndex, pickRandomInstruction]);

  useEffect(() => {
    if (currentInstructionIndex !== null) {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 500);
    }
  }, [currentInstructionIndex]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await detectFace();
    }, 100);

    return () => clearInterval(interval);
  }, [detectFace]);

  return {
    videoRef,
    canvasRef,
    loading,
    flashing,
    instructions,
    currentInstructionIndex,
    isLivenessVerified,
  };
};

export default useLivenessCheck;
