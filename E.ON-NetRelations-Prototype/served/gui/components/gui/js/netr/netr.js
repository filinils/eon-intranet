/** 
@namespace NetRelations
*/
netr = {
	updateLike: function(data){
		var obj = data.split('|')[0];
		var id = data.split('|')[1];
		var destinationLikes = $('#' + id).find('span').first();
		var currentLikes = parseInt(destinationLikes.html());
		if($('#' + obj).hasClass('selected')){
			destinationLikes.html(currentLikes + 1);
		}else{
			destinationLikes.html(currentLikes - 1);
		}
	}
};