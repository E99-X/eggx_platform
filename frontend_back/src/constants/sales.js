import eggx from "../assets/symbol.svg";
import yolk from "../assets/yolk.svg";
import chick from "../assets/chick.svg";
const ORIGIN = window.location.origin;

export const SALES = [
  {
    id: "default",
    name: "EGGX",
    saleId:
      "0x0a82f1594a0851a3297e48e7c36f13dc0d8d9ba3f5c751bca632e3d8e6eb422d",
    avatar:
      process.env.NODE_ENV === "production"
        ? `${ORIGIN}/avatars/eggx.svg`
        : eggx,
    primaryColor: "#d0cfcf",
    bgrColor: "#1c1c1e",
    accentColor: "#f8df00",
  },
  {
    id: "yolk",
    name: "YOLK",
    saleId:
      "0xce8a1f8bbd9277b3173b4f298a96bf42163a780211cded66e08f4475fba266a8",
    avatar:
      process.env.NODE_ENV === "production"
        ? `${ORIGIN}/avatars/yolk.svg`
        : yolk,
    primaryColor: "#d0cfcf",
    bgrColor: "#1c1c1e",
    accentColor: "#c08fff",
  },
  {
    id: "chick",
    name: "CHICK",
    saleId:
      "0x2e57c948930f51352f7492cbeff28a20504bfa492b004191089264f624480fcb",
    avatar:
      process.env.NODE_ENV === "production"
        ? `${ORIGIN}/avatars/chick.svg`
        : chick,
    primaryColor: "#d0cfcf",
    bgrColor: "#1c1c1e",
    accentColor: "#ff9b40",
  },
];
