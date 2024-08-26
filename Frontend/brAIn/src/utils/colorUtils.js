// utils/colorUtils.js

export const getRandomColor = () => {
    const colors = [
      '#FFDDC1', // Light Peach
      '#FFABAB', // Light Coral
      '#FFC3A0', // Light Pink
      '#FF677D', // Light Rose
      '#D4A5A5', // Light Red
      '#392F5A', // Deep Purple
      '#5B9AA0', // Light Teal
      '#F3A712', // Bright Yellow
      '#F7C6C7', // Light Salmon
      '#D5AAFF', // Lavender
      '#B5EAD7', // Light Green
      '#C9D9D9'  // Light Grey
    ];
  
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  