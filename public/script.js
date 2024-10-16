document.addEventListener('DOMContentLoaded', () => {
  const korean = document.getElementById('ko');
  const arabic = document.getElementById('ar');

  const translate = async (word) => {
    try {
      const response = await fetch('/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: word, target: 'ar' }),
      });
      
      const data = await response.json();
      return data.translation;
    }
    catch (error) {
      console.error('오류 발생:', error);
    }
  }

  let debouncer;
  const inputListener = async (event) => {
    const koreanWord = event.target.value;

    clearTimeout(debouncer);

    debouncer = setTimeout(async () => {
      const translatedWord = await translate(koreanWord);
      arabic.value = translatedWord;
    }, 500);
  };

  korean.addEventListener('input', inputListener);
});