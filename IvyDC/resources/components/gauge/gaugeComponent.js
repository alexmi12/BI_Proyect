/*!
* Copyright 2014 - 2014 Ivy Information Systems Ltd.  All rights reserved.
* 
* This software was developed by Webdetails and is provided under the terms
* of the Mozilla Public License, Version 2.0, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/
var gaugeComponent = BaseComponent.extend({

	GUID: function(){
		function S4() { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); };
		return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	},

	gaugeChartObj: [],

	gridSize: function(rowNum){
		if(rowNum == 1){
			return [1, "100%"];
		}else if(rowNum > 3){
			return [4, "25%"];
		}

		return [2, "50%"];
	},

	update : function() {
		var myself=this;

		$("#"+myself.htmlObject).empty();

		if(!myself.queryDefinition){
			console.log("query not defined");
			dataViewerHTML = "<b>We need to set a query with two fields of data!</b>";
		} else {

			if(Dashboards.debug!=1)Dashboards.log("Datasource has been added");
			
			var query = new Query(myself.queryDefinition);
			
			if(Dashboards.debug!=1)Dashboards.log("Parameters: " + JSON.stringify(myself.parameters)||"<no parameters>");

			query.fetchData(myself.parameters, function(values) {

				var gridConf = myself.gridSize(values.resultset.length);

				var currRow, currCol;
				for(var idx = 0; idx<values.resultset.length; idx++){
					if(idx==0||idx%gridConf[0]==0){
						currRow = myself.GUID();
						$("#"+myself.htmlObject).append("<div class='row' id ="+currRow+"></div>");
					}

					currCol = myself.GUID();
					$("#"+currRow).append("<div style='float: left; width: "+gridConf[1]+";' id ="+currCol+"></div>");

					var actualValue, minValue, maxValue, title, subtitle;
					if(myself.label == undefined){
						title = values.resultset[idx][0];
					} else {
						title = myself.label;
					}
					
					if(myself.subTitle == undefined){
						subTitle = "";
					} else {
						subTitle = myself.subTitle;
					}
					
					if(myself.maxValue == undefined){
						minValue = values.resultset[idx][2];
					} else {
						minValue = myself.minValue;
					}
					
					if(myself.maxValue == undefined){
						maxValue = values.resultset[idx][3];
					} else {
						maxValue = myself.maxValue;
					}
					
					var gageConf = {
						id: currCol, 
						value: values.resultset[idx][1], 
						min: minValue,
						max: maxValue,
						title: title,
						label:subTitle,
						gaugeWidthScale:myself.gaugeWidthScale,
	          			symbol: myself.gaugeSymbol,
	        			relativeGaugeSize: true,
	        			formatNumber: myself.formatNumber,
	        			donut: myself.gaugeType == "doughnut"
					};

					if(myself.textRenderer != undefined && typeof myself.textRenderer == "function"){
						gageConf.textRenderer = myself.textRenderer;
					}

					if(values.resultset[idx][4] !== undefined){
						gageConf.gaugeColor = values.resultset[idx][4];
					}

					if(values.resultset[idx][5] !== undefined){
						var lvlColors = [values.resultset[idx][5]];
						if(values.resultset[idx][6] !== undefined){
							lvlColors.push(values.resultset[idx][6]);
						}
						if(values.resultset[idx][7] !== undefined){
							lvlColors.push(values.resultset[idx][7]);
						}
						gageConf.levelColors = lvlColors;
					}

					var extension = {};
					if(myself.extensionPoints != undefined && myself.extensionPoints[0] != undefined){
						for(var i = 0; i < myself.extensionPoints.length; i++){
							extension[myself.extensionPoints[i][0]] = typeof myself.extensionPoints[i][1] === 'function'?myself.extensionPoints[i][1]():myself.extensionPoints[i][1];
						}
					}

					gageConf = $.extend({}, gageConf, extension);

					if(Dashboards.debug!=1)Dashboards.log("Final gage properties: " + JSON.stringify(gageConf, function(key, val) { if (typeof val === 'function') {return val.toString();}return val;})||"<no properties>");
					
					new JustGage(gageConf);
					
					myself.gaugeChartObj[currCol] = gageConf;
					if(myself.expression!==undefined){
						$("#"+currCol).click(function(e){
							myself.expression(e, myself.gaugeChartObj[e.currentTarget.id]);
						});
					}
				}
			});
		}
	}
});