/* eslint-disable  func-names */
/* eslint-disable  no-console */
'use strict';
var Alexa = require("alexa-sdk");
//const Alexa = require('ask-sdk-core');

const SKILL_NAME = 'Neck Relax';
const START_MESSAGE = 'Let\'s start training: ';
const HELP_MESSAGE = 'This skill helps you relax your neck, you simply need to follow the instructions... You can say start training';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const AUDIO='<audio src=\'https://s3.amazonaws.com/ask-soundlibrary/nature/amzn_sfx_ocean_wave_surf_01.mp3\'/>';

const DONE_MSG0='Say done to continue:';
const DONE_MSG='Say done to continue after nature music ends:';
const STAND_MSG="Stand straight  ";
const SHOULDER_MSG="Keep your shoulders relaxed and down.  ";
const FOUR_MSG="Do this for four times.  Every time try to stretch a little more. ";
const HOLD_MSG="For this fifth time, move slowly and hold for ten seconds.  ";
const POS_MSG0="Now the left direction.  ";
const POS_MSG1="Now the right direction.  ";

const ROT_MSG="Rotate your head from center to shoulder direction in a relaxed form, and then back to center.  ";
const BEND_MSG="Bend over your neck to shoulder direction, but keep shouldler unmoved.  ";
const UP_MSG="Slowly look up into sky and back to square.  ";
const DOWN_MSG="Slowly look down to our chest and back to square.  ";



var trainAction;
var actionPlayed;
var direction;


const handlers = {
    'LaunchRequest': function () {
        trainAction = 0;
		actionPlayed = 0;
		direction=0;		

		const speechOutput = START_MESSAGE + STAND_MSG + SHOULDER_MSG+DONE_MSG0;
        this.emit(':ask',speechOutput,DONE_MSG0);
    },
	'StartTrainingIntent': function () {
        trainAction = 0;
		actionPlayed = 0;
		direction=0;		

		const speechOutput = START_MESSAGE + STAND_MSG + SHOULDER_MSG+DONE_MSG0;
        this.emit(':ask',speechOutput,DONE_MSG0);
    },
	'DoneIntent': function () {
		var PosMsg;
		var ActMsg;
		var NumMsg;
		
		if (trainAction==0) {
			ActMsg=ROT_MSG;
		} else if (trainAction==1) {
			ActMsg=BEND_MSG;
		} else if (trainAction==2) {
			ActMsg=UP_MSG;
		} else if (trainAction==3) {
			ActMsg=DOWN_MSG;
		} else {
			this.response.speak('You have given your neck some rest. Wish you good fit every day.');        
			this.emit(':responseReady');
		}
		trainAction=trainAction+direction*actionPlayed;
		
		if (direction==0) {
			PosMsg=POS_MSG0;
		} else {
			PosMsg=POS_MSG1;
		}
		//01010101
		//00110011
		//direction=1-direction;
		
		if (actionPlayed==0) {
			NumMsg=FOUR_MSG;
			direction=direction;
		} else {
			NumMsg=HOLD_MSG;
			direction=1-direction;
		}
		actionPlayed= 1-actionPlayed;

		const speechOutput = PosMsg + ActMsg + NumMsg+DONE_MSG+AUDIO+AUDIO+AUDIO+AUDIO+AUDIO;
		this.emit(':ask',speechOutput,DONE_MSG);
	},
	"AMAZON.NoIntent": function() {
        const speechOutput = DONE_MSG;
		this.emit(':ask',speechOutput,speechOutput);
    },
	'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_MESSAGE;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
	'Unhandled': function () {
		this.emit(':tell', STOP_MESSAGE);
        //this.emit(':responseReady');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    //alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};