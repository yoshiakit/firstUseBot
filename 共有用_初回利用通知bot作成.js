
// FYI：https://qiita.com/gkzz/items/dd05af5bdcdfdb290f9d
// GotGASにて下記の読み込みが必要。
/*
library key;
moment.js
MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48
*/


//テスト用関数(1)
function sendingTest(){
	sendToRoom("テスト通知です。", "#hogehoge")
}

//テスト用関数(2)
function parsingTest(){
	var period = 1;
    var filter =  /.*案件ID:[0-9]{1,}-1[^0-9].*/;
    
    var isYear = true;  
    const SLACK_LEGACY_TOKEN = "xoxp-nanchara";
    const BASE_URL = "https://slack.com/api/channels.history?";

    //取得元のチャンネルID
    const FROM_CHANNEL_ID = "Z999XXXZ9Z"; 
    //送信先のチャンネルのWebhook URL
    const INCOMING_WEBHOOK_URL = 'https://hooks.slack.com/services/hogehoge/higehige/hugehuge';


　　//channels.historyで特定のチャンネルへの投稿情報をmessagesに格納し、reverse()で日付が若い順とする
    var messages = JSON.parse(
        getSlackLog(SLACK_LEGACY_TOKEN, FROM_CHANNEL_ID, BASE_URL, period)
    )
    .messages
    .reverse();

    if ( !messages ) {
        return;
    }
    var logs = parseSlackLog(messages, isYear, filter);


    for ( var i = 0; i<logs.length; i++  ) {
    }
}



function main() {
  var period = 1;　//channels.historyで投稿情報を取得する期間(日単位)
  var filter =  /.*案件ID:[0-9]{1,}-1[^0-9].*/;
  var isYear = true;    //投稿日時のフォーマット(年有り)

  const SLACK_LEGACY_TOKEN = "xoxp-nanchara";
  const FROM_CHANNEL_ID = "C833MCP9B";
  const BASE_URL = "https://slack.com/api/channels.history?";

  const INCOMING_WEBHOOK_URL = 'https://hooks.slack.com/services/hogehoge/higehige/hugehuge';


　　//channels.historyで特定のチャンネルへの投稿情報をmessagesに格納し、reverse()で日付が若い順とする
    var messages = JSON.parse(
        getSlackLog(SLACK_LEGACY_TOKEN, FROM_CHANNEL_ID, BASE_URL, period)
    )
    .messages
    .reverse();

    if ( !messages ) {
        return;
    }
    var logs = parseSlackLog(messages, isYear, filter);

    for ( var i = 0; i<logs.length; i++  ) {
       sendToRoom(textDefine(logs[i]["posted_date"], logs[i]["content"]));    
    }
}

//(1)データを持ってくる

function getSlackLog(token, id, url) {
    var payloadAlpha = {
      'token': token,
      'channel': id,
      'oldest': parseInt( new Date() / 1000 ) - (60 * 60 * 24),
   	  'count': 1000
    }

    var params = [];
    for (var key in payloadAlpha) {
        params.push(key + '=' + payloadAlpha[key]);
    }
    var requestUrl = url + params.join('&');
    return UrlFetchApp.fetch(requestUrl);
}

//(2)データを整頓する
function parseSlackLog(array, booleanValue,  filter) {
    var logs = [];
    var log = {"posted_date": "", "content": "",};

    for each( var val in array ) {
        if ( val["text"].match(filter) ){
          log["posted_date"] = getMomentDateTime(val.ts, booleanValue);
          log["content"] = val.text; 
          logs.push(log);
        }
    }
    return logs;
}


//(3)時間設定
function getMomentDateTime(unixtime, booleanValue) {
    Moment.moment.lang(
      'ja', {
        weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
        weekdaysShort: ["日","月","火","水","木","金","土"],
      }
    );
    if ( booleanValue ) {
        return Moment.moment(unixtime * 1000)
            .format('YYYY/MM/DD(ddd) HH:mm:ss');
    } else {
        return Moment.moment(unixtime * 1000)
            .format('MM/DD(ddd) HH:mm:ss');
    }
}



//(4)Slackに送るメッセージを決める
function textDefine(posted_date, detail){
	var title = "notify-orderにて初回利用を検知しました。感謝。";
	var options = {
		"channel" : "#hogehoge",
		"username" : "初回利用検知bot", 
		"icon_emoji" : ":date: " ,
		"attachments":[
			{
				"fallback": "This is an update from a Slackbot integrated into your organization. Your client chose not to show the attachment.",
            	"color": "#76E9CD",
				"fields":[
					{
						"title":title,
						"value":"",
						"short":false
					},
					{
						"title":"依頼日時",
						"value":posted_date,
						"short":false
					},
					{
						"title":"通知内容",
						"value":detail,
						"short":false
					}

				],
			}
		]
	};
	return JSON.stringify(options);
}
	


//(5)Slackにメッセージを送る
function sendToRoom(definedMsg){
    var url = "https://hooks.slack.com/services/hogehoge/higehige/hugehuge";
	var options = {
    	"method" : "POST",
    	"contentType" : "application/json",
    	"payload" : definedMsg
  	};
	var response = UrlFetchApp.fetch(url, options);
}

