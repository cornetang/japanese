/*
 * Check for browser support
 */
$(document).ready(function() {
  var supportMsg = document.getElementById('msg');

  if ('speechSynthesis' in window) {
    supportMsg.innerHTML = 'Your browser <strong>supports</strong> speech synthesis';
  } else {
    supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
    supportMsg.classList.add('not-supported');
  }


  // Get the voice select element.
  var voiceSelect = document.getElementById('voice');

  // Define attributes
  var rateInput = 1;
  var volumeInput = 1;
  var includeEnglish = true;

  function loadVoices() {
    // Fetch the available voices
    var voices = speechSynthesis.getVoices();
    voices.forEach(function(voice, i) {
      if (voices[i].lang == "ja-JP") {
        var option = document.createElement('option');
        option.value = voice.name;
        option.innerHTML = voice.name;
        voiceSelect.appendChild(option);
        $("#voice").selectpicker("refresh")
      }
    });
  }

  // Execute loadVoices.
  loadVoices();

  // Chrome loads voices asynchronously.
  window.speechSynthesis.onvoiceschanged = function(e) {
    loadVoices();
  };

  window.speechSynthesis.cancel();

  // on click speak button
  $("#speakButton").click(function() {
    var speechMsg = $("#speech-msg").val();
    if (!includeEnglish) speechMsg = speechMsg.replace(/[a-z]/gi, '');
    if (speechMsg.length > 0) {
      if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
      else {
        var msg = new SpeechSynthesisUtterance();
        msg.text = speechMsg;
        msg.volume = volumeInput;
        msg.rate = rateInput;
        msg.lang = 'ja-JP';
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect.value; })[0];
        // console.log("volumn: " + msg.volume + ", rate: " + msg.rate + ", voice: " + msg.voice.name);

        window.speechSynthesis.speak(msg);
        $("#speech-msg").prop('disabled', true);
        msg.addEventListener('end', function () {
        　$("#speech-msg").prop('disabled', false);
        })
      }
    }
  });

  // on click pause button
  $("#pauseButton").click(function() {
    window.speechSynthesis.pause();
  });

  // on click cancel button
  $("#cancelButton").click(function() {
    window.speechSynthesis.cancel();
    $("#speech-msg").prop('disabled', false);
  });

  // on click reset button
  $("#resetButton").click(function() {
    // cancel synthesis
    window.speechSynthesis.cancel();
    
    // reset speed
    $("#rateDefault").trigger("click");
    rateInput = 1;
    
    // reset volume
    $('#volume').val(1);
    volumeInput = 1;
    $("#volumeText").text("with volume 100%");
    
    // reset English button
    $("#englishButton").prop('checked', true).change();
    
    // reset text area
    $("#speech-msg").prop('disabled', false);
    $("#speech-msg").val('');
  });

  // on change speed button
  $("#rateButtons input").change(function() {
    rateInput = parseFloat(this.name);
  });

  // on change volume slider
  $("#volume").change(function(){
    volumeInput = parseFloat($('#volume').val());
    $("#volumeText").text("with volume " + $('#volume').val()*100 + "%");
  });

  // on change English toggle button
  $("#englishButton").change(function() {
    includeEnglish = $("#englishButton").is(':checked');
  })
});

