document.addEventListener('DOMContentLoaded', () => {
  const korean = document.getElementById('ko');
  const arabic = document.getElementById('ar');
  const koTextArea = korean.getElementsByTagName('textarea')[0];
  const arTextArea = arabic.getElementsByTagName('textarea')[0];

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

  const setPlaceHolder = () => koTextArea.placeholder = '본인의\n이름을\n적어보세요';


  const clearText = async () => {
    arTextArea.value = '';
    koTextArea.value = '';
  }

  let debouncer;
  let clearTimer;
  const inputListener = async (event) => {
    const koreanWord = event.target.value;
    
    clearTimeout(debouncer);
    clearTimeout(clearTimer);

    debouncer = setTimeout(async () => {
      const translatedWord = await translate(koreanWord);
      arTextArea.value = translatedWord + '\n';
      clearTimer = setTimeout(clearText, 30000);
    }, 500);
  };

  setPlaceHolder();
  korean.addEventListener('input', inputListener);
});
