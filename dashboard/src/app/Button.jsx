import { Button } from "@mui/material";
import Link from 'next/link';
export default function FadeIn({ text, url }) {
  return (
    <Link href={url} passHref>
      <Button
        variant="outlined"
        style={{
          backgroundColor: "transparent",
          marginTop: "30px",
          color: "black",
          border: "2px solid black",
          padding: "10px 20px",
          borderRadius: "0",
          transition: "background-color 0.3s ease",
          fontWeight: "bold",
          width: "200px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {text}
      </Button>
    </Link>
  );
}
