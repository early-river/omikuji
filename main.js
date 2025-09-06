//各カウンターの要素を取得
const omikujiCounterElement = document.getElementById('omikuji-counter');
const daikichiCounterElement = document.getElementById('daikichi-counter');
const daikyoCounterElement = document.getElementById('daikyo-counter');
const currentCounterElement = document.getElementById('current-concecutive-counter');
const recordCounterElement = document.getElementById('record-counter');
const recordUpdateTextElement = document.getElementById('record-update-text');

let omikujiCount = Number(localStorage.getItem('omikujiCount')) || 0; 
omikujiCounterElement.textContent = omikujiCount;

let daikichiCount = Number(localStorage.getItem('daikichiCount')) || 0; 
daikichiCounterElement.textContent = daikichiCount;

let daikyoCount = Number(localStorage.getItem('daikyoCount')) || 0; 
daikyoCounterElement.textContent = daikyoCount;

let currentCosecutiveDaikichi = 0; 

let daikichiRecord = Number(localStorage.getItem('daikichiRecord')) || 0; 
recordCounterElement.textContent = daikichiRecord;


//テキストボックス・ボタンの要素を取得
const resultNameElement = document.getElementById('result-name');
const resultMessageElement = document.getElementById('result-message');
const drawButtonElement = document.getElementById('draw-button');


//ログ
const logListElement = document.getElementById('log-list');
const logContainerElement = document.getElementById('log-container');


//おみくじの中身。今回は配列の中身をオブジェクトにして、nameとmessageで別々の箇所に表示されるようにする
const fortunes = [
    { name: '大吉', message: '最高の1日! 何か新しいことを始めると吉。' },
    { name: '中吉', message: 'まずまずの日。焦らず慎重に行動しよう。' },
    { name: '小吉', message: '小さな幸せがありそう。周りをよく見て。' },
    // { name: '吉',   message: '平穏な日。普段通りが一番。' },
    // { name: '末吉', message: '少し注意が必要。忘れ物に気をつけて。' },
    // { name: '凶',   message: 'トラブルの予感。今日は控えめに。' },
    { name: '大凶', message: '・・・。ラッキーアイテムはハンカチです。' }
];



//ボタンクリックを検知した際に発生するイベント
drawButtonElement.addEventListener('click', () => {
   
    // スタイルのリセット処理
    const defaultFontSize = '20px';
    const defaultFontColor = 'black';
    resultNameElement.style.color = defaultFontColor;
    resultNameElement.style.fontSize = defaultFontSize;
    document.body.style.backgroundColor = '#f0f8ff'; 
    recordUpdateTextElement.classList.add('hidden');
    recordUpdateTextElement.classList.remove('blinking');

    // クリック直後の表示
    resultNameElement.textContent = '.';
    resultMessageElement.textContent = '占っています.';


setTimeout(() => {
    resultNameElement.textContent = '..';
    resultMessageElement.textContent = '占っています..';

    setTimeout(() => {
        resultNameElement.textContent = '...';
        resultMessageElement.textContent = '占っています...';
    }, 166);
}, 166);

    
    //クリックから結果までにロード時間を追加
    setTimeout(() => {


    //0~6までのランダムな整数で配列の要素を決定
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const selectedFortune = fortunes[randomIndex];
    
    //決定した要素でHTMLを上書き
    resultNameElement.textContent = selectedFortune.name; 
    resultMessageElement.textContent = selectedFortune.message; 

    //累計おみくじ回数の加算・保存・表示
    omikujiCount++;
    localStorage.setItem('omikujiCount', omikujiCount);
    omikujiCounterElement.textContent = omikujiCount;

    console.log(selectedFortune.name);
    console.log(selectedFortune.message);



    

    // ログを作成
    const newLogItem = document.createElement('li');
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    newLogItem.textContent = `[${timestamp}] ${selectedFortune.name}`;

    if (selectedFortune.name === '大吉') {
    newLogItem.style.color = '#ffd700'; 
    } else if (selectedFortune.name === '大凶') {
    newLogItem.style.color = '#00bfff'; 
    }

    // ログリストに新しいログを追加
    logListElement.appendChild(newLogItem);

    // 常に一番下にスクロールさせる
    logListElement.scrollTop = logListElement.scrollHeight;

    // ログが多すぎたら古いものから消す 
    if (logListElement.children.length > 500) {
        logListElement.firstChild.remove();
    }




    if (selectedFortune.name === '大吉') {
        daikichiCount++;
        localStorage.setItem('daikichiCount', daikichiCount);
        daikichiCounterElement.textContent = daikichiCount;

        resultNameElement.style.color = 'red';
        resultNameElement.style.fontSize = '50px';
        document.body.style.backgroundColor = 'pink';


    } else if (selectedFortune.name === '大凶') {
        daikyoCount++;
        localStorage.setItem('daikyoCount', daikyoCount);
        daikyoCounterElement.textContent = daikyoCount;

        resultNameElement.style.color = 'blue';
        document.body.style.backgroundColor = '#b29fc7ff';
    }

    if (selectedFortune.name === '大吉') {
        // 現在の大吉記録に加算・表示
        currentCosecutiveDaikichi++;
        currentCounterElement.textContent = currentCosecutiveDaikichi;

        // 現在の連続記録が、保存されている記録を超えたら
        if(currentCosecutiveDaikichi > daikichiRecord) {
            daikichiRecord = currentCosecutiveDaikichi; //記録の更新
            localStorage.setItem('daikichiRecord', daikichiRecord); //記録を保存
            recordCounterElement.textContent = daikichiRecord; //記録に表示
            recordUpdateTextElement.classList.remove('hidden'); //記録更新中の文字を表示
            recordUpdateTextElement.classList.add('blinking'); //記録更新中テキストの明滅を開始
        }
    } else {
        currentCosecutiveDaikichi = 0;
        currentCounterElement.textContent = currentCosecutiveDaikichi;
    }

    }, 500);
    
});

const resetButtonElement =  document.getElementById('reset-button');

resetButtonElement.addEventListener('click', () => {
    const isConfirmed = confirm('本当にすべての記録をリセットしますか？');

    if(isConfirmed) {
        // localStorageからデータを削除
        localStorage.removeItem('omikujiCount');
        localStorage.removeItem('daikichiCount');
        localStorage.removeItem('daikyoCount');
        localStorage.removeItem('daikichiRecord');

        // 変数をリセット
        omikujiCount = 0;
        daikichiCount = 0;
        daikyoCount = 0;
        daikichiRecord = 0;
        currentCosecutiveDaikichi = 0;

        // 画面表示をリセット
        omikujiCounterElement.textContent = 0;
        daikichiCounterElement.textContent = 0;
        daikyoCounterElement.textContent = 0;
        recordCounterElement.textContent = 0;
        currentCounterElement.textContent = 0;

        // 明滅テキストも隠す
        recordUpdateTextElement.classList.add('hidden');
        recordUpdateTextElement.classList.remove('blinking');

        alert('記録をリセットしました。');
    }
});
