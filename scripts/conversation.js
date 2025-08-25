var prev = []; // question stack
var current = []; // current question
var asked = new Set([]); // set of asked questions for greying out
var listElement = null;
var portraitElement = null;
var speechElement = null;
var answerElement = null;
var currentSpeechAnimation1 = null; // start of emotion
var currentSpeechAnimation2 = null; // start of speech
var currentTextAnimation = null; // type-in animation
var currentFaceAnimation = null; // linger of emotion
var audio = null; // speaking tone
var audiolow = null; // speaking tone
var audiohigh = null; // speaking tone
const eyes = ["", "happy", "thinking", "angry", "wink"];
const mouths = ["", "smile", "frown", "tongue"]
const effects = ["", "nervous", "bruised"];

function goBack() {
    current = prev.pop();
    setQuestions(current, prev.length == 0);
}

async function getResponse(event, response) {

    const target = event.currentTarget;
    const question = target.children[0].innerText;

    asked.add(question);
    target.classList.add("asked");

    if (response.next && response.next.length > 0) {
        prev.push(current);
        current = response.next;
        if (typeof current === "string") {
            const file = await fetch(`../res/${current}`);
            current = await file.json(); 
        }
        setQuestions(current, false);
    }

    displayResponse(response);
}

function clearEmotions() {
    const emotions = [...eyes, ...mouths, ...effects];
    emotions.forEach(e => e && portraitElement.classList.remove(e));
}

function clearAnimations() {
    if (currentSpeechAnimation1) clearTimeout(currentSpeechAnimation1);
    if (currentSpeechAnimation2) clearTimeout(currentSpeechAnimation2);
    if (currentTextAnimation) clearInterval(currentTextAnimation);
    if (currentFaceAnimation) {
        clearEmotions();
        clearTimeout(currentFaceAnimation);
    }
    portraitElement.classList.remove("talking");
    speechElement.style.display = "none";
}

function adHocEmotion(emotion) {
    clearAnimations();
    for (const key in emotion)
        portraitElement.classList.add(emotion[key]);
    currentFaceAnimation = setTimeout(() => {
        clearEmotions();
        clearAnimations();
    }, 1000);
}

function getRandomEmotion() {
    const eye = eyes[Math.floor(Math.random() * eyes.length)];
    const mouth = mouths[Math.floor(Math.random() * mouths.length)];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const emotion = {
        ...(eye && {eye: eye}),
        ...(mouth && {mouth: mouth}),
        ...(effect && {effect: effect})
    };
    return emotion;
}

function speechAnimation(response) {
    let timing = 70;

    currentSpeechAnimation2 = setTimeout(() => {
        let i = 0;
        let textContent = answerElement.textContent;

        currentTextAnimation = setInterval(() => {
            textContent += response.content[i];
            answerElement.textContent = textContent;

            timing = 70 + (Math.random() * 10 - 5);

            /* sliding window on [low, low, med, high, high] depending on emotion */
            const tone = Math.floor(Math.random() * 3) + (
                response.emotion?.eyes === "happy" ? 1 :
                response.emotion?.eyes === "angry" ? -1 : 
                0    
            );
            if (tone == -1)
                audiolow.play();
            else if (tone == 0)
                audiolow.play();
            else if (tone == 1)
                audio.play();
            else if (tone == 2)
                audiohigh.play();
            else if (tone == 3)
                audiohigh.play();

            i++;
            if (i >= response.content.length) {
                currentFaceAnimation = setTimeout(() => {
                    clearEmotions();
                    clearTimeout(currentFaceAnimation);
                }, 500);
                portraitElement.classList.remove("talking");
                clearInterval(currentTextAnimation);
            }
        }, timing);
    }, 400);
}

async function displayResponse(response) {
    clearAnimations();
    clearEmotions();
    
    for (const key in response.emotion)
        portraitElement.classList.add(response.emotion[key]);

    currentSpeechAnimation1 = setTimeout(() => {
        portraitElement.classList.remove(response.emotion?.mouth);
        portraitElement.classList.add("talking");
        speechElement.style.display = "block";
        answerElement.textContent = "";

        speechAnimation(response);
    }, 600);
}

function setQuestions(questions, isRoot) {
    if (questions.length == 0) return;

    const backButton = document.createElement("button");
    backButton.classList.add("questionButton");
    backButton.innerText = "<";
    backButton.onclick = () => goBack();

    const backElement = document.createElement("li");
    backElement.classList.add("question");
    backElement.append(backButton);

    const questionNodes = [
        ...(isRoot ? [] : [backElement]), 
        ...questions.map((question, index) => {
            const questionText = document.createElement("p");
            questionText.innerText = `${index + 1}. ` + question.question;

            const forwardButton = document.createElement("p");
            forwardButton.classList.add("forwardButton");
            forwardButton.innerText = ">";

            const questionButton = document.createElement("button");
            questionButton.classList.add("questionButton");
            questionButton.classList.add(asked.has(questionText.innerText) ? "asked" : "notAsked");
            questionButton.onclick = (e) => getResponse(e, question.response);
            questionButton.append(questionText);
            if (question.response.next && question.response.next.length > 0)
                questionButton.append(forwardButton);

            const questionElement = document.createElement("li");
            questionElement.classList.add("question");
            questionElement.append(questionButton);

            return questionElement;
        })
    ];

    listElement.replaceChildren();
    questionNodes.forEach(e => listElement.append(e));
}

document.addEventListener("DOMContentLoaded", async function() {
    const file = await fetch("../res/conversation.json");
    const conversation = await file.json();
    listElement = document.getElementById("questionList");
    portraitElement = document.getElementById("portrait");
    speechElement = document.getElementById("speech");
    answerElement = document.getElementById("answer");
    audio = new Audio("../res/speak.wav");
    audiolow = new Audio("../res/speak-low.wav");
    audiohigh = new Audio("../res/speak-high.wav");

    portraitElement.onclick = () => adHocEmotion(getRandomEmotion());

    current = conversation;
    setQuestions(current, true);
});