$(function(){
      $("#menu").load("../sidebar_menu.html"); 
});
$(document).ready(function(){
var loc_type_data;

$.ajax({
  type: "GET",
  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/location/getroot",
  contentType: "application/json; charset=utf-8",
  dataType: "JSON",
  success: function(data){
	
    loc_type_data = "<span>Country</span>   <b>"+data.name+"</b></br> <span>State</span><select id='state' onchange='fetchChildren(this)' >";
		 
	$.when($.ajax({
	  type: "GET",
	  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/location/getchild/"+data.id,
	  contentType: "application/json; charset=utf-8",
	  dataType: "JSON",
	  success: function(data){
		for(var i=0; i < data.length; i++){
			loc_type_data += "<option value='"+data[i].id+","+data[i].locationTypeId+"' >"+data[i].name+"</option>";
			
		}	
	  }
	})).done(function(){
	loc_type_data += "</select>";
	$('#location-filter').html(loc_type_data); 
	});
								
  }
});
	

$( "#search-person" ).autocomplete({
	source: "http://dev.admin.eswaraj.com/eswaraj-web/ajax/person/search/name/",
	minLength: 3 
});

	
});

function fetch_form_data(){

$("#add-new-admin").css("display","block");

$.ajax({
  type: "GET",
  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/party/getall",
  contentType: "application/json; charset=utf-8",
  dataType: "JSON",
  success: function(data){
 
    var party_data = "";
	for(var i=0;i<data.length;i++){
	party_data += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
	}
					
	$('#party_data').html(party_data);							
  }
});


$.ajax({
  type: "GET",
  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/pbtype/get",
  dataType: "JSON",
  success: function(data){
  
  var location_dd =$("#location_type_id").html();
  
  if(data.length>0){
    
	for(var i=0;i< data.length;i++){
	 location_dd += "<option value='"+data[i].id+"'>"+data[i].name+"</option>" ;
	}
	
	$("#admin_type_data").html(location_dd);
  }
   
  }});
  
}

function add_update_admin(){
/* 
{
    "id": 33132,// Required only if it is Update request for create it should be null
    "politicalBodyTypeId": "12",
    "locationId": "23",
    "personId": "45",
    "partyId": "67",
    "email": "ravi@eswaraj.com",
    "landLine1": "9876543210",
    "landLine2": "8796543210",
    "mobile1": "1234567890",
    "mobile2": "5647382910",
    "startDate": "1234567890", //date as milliseonds
    "endDate": "1234567890", //date as milliseonds
    "officeAddressDto": {
           "id": 33132,     
           "line1":"Address Line1",
           "line2":"Address Line2",
           "line3":"Address Line3",
           "postalCode":"121102",
           "villageId":"12",
           "wardId":"23",
           "cityId":"34",
           "districtId":"45",
           "stateId":"56",
           "countryId":"67"
          }
      "homeAddressDto": {
           "id": 33133,     
           "line1":"Address Line1",
           "line2":"Address Line2",
           "line3":"Address Line3",
           "postalCode":"121102",
           "villageId":"12",
           "wardId":"23",
           "cityId":"34",
           "districtId":"45",
           "stateId":"56",
           "countryId":"67"
          }

    }
 */
var post_data = {
  "id":$("#admin_type_id").val(),
   "shortName":$("#short_name").val(),
   "name":$("#full_name").val(),
   "description":$("#admin_description").val(),
   "locationTypeId":$("#location_type_id").val()
   
  };
 // alert(JSON.stringify(post_data));
$.ajax({
  type: "POST",
  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/pbtype/save",
  data: JSON.stringify(post_data),
  contentType: "application/json; charset=utf-8",
  dataType: "JSON",
  success: function(data){
  var count = document.getElementById('admin_type_data').rows.length;
  //alert(count);
  if(post_data.id){
   
  $("#admin_type_name"+post_data.id).html($('#full_name').val());
  $("#admin_type_short_name"+post_data.id).html($('#short_name').val());
  $("#admin_type_description"+post_data.id).html($('#admin_description').val());
  $("#admin_type_locationTypeId"+post_data.id).html($('#location_type_id').val());
  } else {
  if(count ==0){ count =1;}
  var admin_type_data ="<tr><td>"+(count)+"</td><td id='admin_type_name"+data.id+"'>"+data.name+"</td><td id='admin_type_short_name"+data.id+"'>"+data.shortName+"</td><td id='admin_type_description"+data.id+"'>"+data.description+"</td><td id='admin_type_locationTypeId"+data.id+"'>"+data.locationTypeId+"</td><td><a id='"+data.id+"' value='"+data.id+"' description='"+data.description+"' short_name='"+data.shortName+"' location_type_id ='"+data.locationTypeId+"' full_name='"+data.name+"' class='btn blue' onclick='return runMyFunction(event);' href='#add-admin-type' data-toggle='modal'><i class='fa fa-pencil'></i></a></td></tr> ";
  var prev_admin_type_data = $('#admin_type_data').html();					
  $('#admin_type_data').html(prev_admin_type_data+admin_type_data);	}
  
  }
});
	
}

function get_child_location_type(loc_typeid){

   $.ajax({
	  type: "GET",
	  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/locationtype/getchild/loc_typeid",
	  contentType: "application/json; charset=utf-8",
	  dataType: "JSON",
	  success: function(data){
		return data;						
	  }
	});
   
}

function get_child_nodes(parent_id){

 $.ajax({
	  type: "GET",
	  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/location/getchild/"+parent_id,
	  contentType: "application/json; charset=utf-8",
	  dataType: "JSON",
	  success: function(data){
		states =  data;		
	  }
	});

}

function fetchChildren(event){
var params = $("#"+event.id).val().split(',');
alert(params[1]);
$.ajax({
		  type: "GET",
		  url:"http://dev.admin.eswaraj.com/eswaraj-web/ajax/locationtype/getchild/"+params[1],
		  contentType: "application/json; charset=utf-8",
		  dataType: "JSON",
		  success: function(data){
		       
			   if(data.length == 0){
			   alert("No Children found");
			   } else{
			   var loc_data = "<span>"+data.name+"</span>";
			   $('#location-filter').append(loc_data);			   
			   alert(JSON.stringify(data));
			   } 
		  }
});
		
} 