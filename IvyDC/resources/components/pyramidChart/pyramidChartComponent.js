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
var PyramidChartComponent = BaseComponent.extend({

  update: function(){
  	this.clear();

	var myself=this;
	
	var chartData = [];
	
	if (this.parameters == undefined) {
		this.parameters = [];
	};


	// check if the components datasource is set
	if(!myself.queryDefinition){
		console.log("query not defined");
	} else {
		console.log("datasource has been added");
		// create a query object
		var query = new Query(myself.queryDefinition);
		
		// fire the query objects fetchdata method
		// no params and no callback
		query.fetchData(myself.parameters, function(values) {
			chartData = (typeof myself.postFetch=="function")?myself.postFetch(values):values;

		    $("#" + myself.htmlObject).html('<div id="'+ myself.htmlObject +'protovis"></div>');
		    myself.chartConf = myself.chartDefinition;
		    myself.chartConf.htmlObjectChart = myself.htmlObject +'protovis';
		    myself.chartConf.data = chartData;
		    myself.chartConf.width = myself.getWidth();
		    myself.chartConf.height = myself.getHeight();

			myself.chartObj = new PyramidChart(myself.chartConf);
			myself.chartObj.render();

			var timer;
		    $(window).bind('resize', function(){
		      timer && clearTimeout(timer);
		      timer = setTimeout(function(){
			    myself.chartConf.width = myself.getWidth();
			    myself.chartConf.height = myself.getHeight();
		      	myself.chartObj.update(myself.chartConf);
		      }, 150);
		    });
		    
		});
	}

  },


  getHeight: function(){
    var $ph = this.placeholder();
    return this.height?this.height:($ph.height()>0?$ph.height():$ph.parent().height());
  },

  getWidth: function(){
    var $ph = this.placeholder();
    return this.width?this.width:($ph.width()>0?$ph.width():$ph.parent().width());
  }
});