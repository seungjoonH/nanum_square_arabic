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

  const getLengthWithKoreanWeight = (word) => {
    let length = 0;
  
    for (let char of word) 
      length += (1 + /[\uac00-\ud7af]/.test(char));
  
    console.log(word, length);
    return length;
  }

  let debouncer;
  const inputListener = async (event) => {
    const koreanWord = event.target.value;
    if (getLengthWithKoreanWeight(koreanWord) > 50) {
      korean.value = koreanWord.substring(0, koreanWord.length - 1);
      return;
    }

    clearTimeout(debouncer);

    debouncer = setTimeout(async () => {
      const translatedWord = await translate(koreanWord);
      arabic.innerText = translatedWord;
    }, 500);
  };

  korean.addEventListener('input', inputListener);
});