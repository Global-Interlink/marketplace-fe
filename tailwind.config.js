module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4F4D4D",
        info: "#3B82F6",
        inputBg: "rgba(255, 255, 255, 0.2);",
        error: "#EB5757",
        description: "#646464",
        item: "rgba(255, 255, 255, 0.6);",
        footer: "rgba(0, 0, 0, 0.55)",
        footerL: "rgba(255, 255, 255, 0.55)",
        // linearItem: "rgba(65, 62, 120, 0.6)",
        primaryDark: "#897DBC",
      },
      backgroundImage: {
        bgCommonD: "url('/bgr-d.png')",
        bgCommonL: "url('/bgr-l.png')",
        bgCommonSP: "url('/bg-common.svg')",
        bg404: "url('/bg-404.svg')",
        bgDetail: "url('/bg-detail.svg')",
        bgLinear: "linear-gradient(180deg, #000000 0%, #1E0342 100%);",
        bgLinearLight:
          "linear-gradient(122.94deg, rgba(255, 255, 255, 0.6) 30.34%, rgba(255, 255, 255, 0.18) 78.27%);",
        bgLinearCollectionItem:
          "linear-gradient(180deg, #1B153E 0%, rgba(79, 42, 138, 0.25) 100%);",
        bgLinearNFTItem:
          "linear-gradient(159.23deg, #FFFFFF 12.5%, rgba(255, 255, 255, 0.3) 86.07%);",
        bgProperty: "linear-gradient(#1B153E 100%, #4F2A8A 25% );",
        
      },
      scale: {
        101: "1.01",
      },
      dropShadow: {
        footer: "0px 4px 49px rgba(0, 7, 72, 0.12)",
      },
      backgroundPosition: {
        left120: "136px 0",
        left60: "60px 0",
      },
      boxShadow: {
        footer: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 12px",
        collectionItem: "0px 10px 20px 5px rgba(17, 17, 17, 0.2)",
      },
    },
    fontFamily: {
      sans: ["Lexend", "sans-serif"],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
};
