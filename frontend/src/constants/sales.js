import eggx from "../assets/symbol.svg";
import yolk from "../assets/yolk.svg";
import chick from "../assets/chick.svg";
const ORIGIN = window.location.origin;

export const SALES = [
  {
    id: "default",
    name: "EGGX",
    saleId:
      "0xfdc0099051c8cb49257b5e54b3af9b3eb857da0c97011f5d3ddb5dd1df9a6255",
    tokenType:
      "0x34218f8b8ed94c0c89bdf312188a612a9f9b2b4db6c70ff9c85e1ff52ea973c0::eggx::EGGX",
    adminCapId:
      "0x4542fcdb0a21781ccac48f60fcb92096e80286c9fd85bae23a2ce962133c4406",
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
      "0xc669fb2a98b548a6bebcbfb52db2b8fad6575e83ede45c2b6f37e8f135b4c52b",
    tokenType:
      "0x5e8e44a7fb8009becb135655037d88f0406fb3c051e5a8c3bba53012ea1dc297::yolk::YOLK",
    adminCapId:
      "0x6b484c3d16002976df0135de869348058b1368bd8562b8b1d0eb1351be12e70a",
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
      "0x2065283327ac6fbd266ae4b8f43c33f724f7bf2896286752bdb52760a58a7f35",
    tokenType:
      "0xcdd0b11410f01dec4030f4dbd58c54e97dfc1535b5aa1f0ed6d83d3775797de::chick::CHICK",
    adminCapId:
      "0x705bf8181bac462caeeb886a936f763b5665167a9ac5bbc002ff03c8f55555fd",
    avatar:
      process.env.NODE_ENV === "production"
        ? `${ORIGIN}/avatars/chick.svg`
        : chick,
    primaryColor: "#d0cfcf",
    bgrColor: "#1c1c1e",
    accentColor: "#ff9b40",
  },
];
