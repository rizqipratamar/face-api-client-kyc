import React from "react";
import useLivenessCheck from "./useLivenessCheck";

const LivenessCheck = () => {
  const {
    videoRef,
    canvasRef,
    loading,
    flashing,
    instructions,
    currentInstructionIndex,
    isLivenessVerified,
  } = useLivenessCheck();

  return (
    <div className="w-screen h-dvh">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <>
          <div className="w-full h-dvh flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 h-[98%] w-[90%]"
            />
          </div>
          <div className="w-full absolute top-0 flex justify-center pt-8">
            <div
              role="alert"
              className={`${
                isLivenessVerified
                  ? "alert alert-success w-80"
                  : "alert alert-warning w-80"
              } ${flashing ? "animate-ping opacity-75" : ""}`}
            >
              {isLivenessVerified ? (
                <span>Liveness verification successful!</span>
              ) : (
                <span>{instructions[currentInstructionIndex]}</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LivenessCheck;
