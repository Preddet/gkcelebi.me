import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            backgroundColor: "#000000",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          g
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 72,
            fontWeight: 700,
            color: "#111111",
            display: "flex",
          }}
        >
          Gökberk Çelebi
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 36,
            fontWeight: 600,
            color: "#898989",
            display: "flex",
          }}
        >
          Bioengineering Student
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#808f7e",
            fontWeight: 600,
            display: "flex",
          }}
        >
          gkcelebi.me
        </div>
      </div>
    ),
    { ...size }
  );
}
