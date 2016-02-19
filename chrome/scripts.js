'use strict';
function main () {
	Side.prototype.updateSidebar = function () {
		var pokemonhtml = '';
		for (var i = 0; i < 6; i++) {
			var poke = this.pokemon[i];
			if (i >= this.totalPokemon) {
				pokemonhtml += '<span class="pokemonicon" style="' + Tools.getIcon('pokeball-none') + '"></span>';
			} else if (!poke) {
				pokemonhtml += '<span class="pokemonicon" style="' + Tools.getIcon('pokeball') + '" title="Not revealed"></span>';
			} else {
				pokemonhtml += '<span class="pokemonicon" style="' + Tools.getIcon(poke) + '" title="' + poke.getFullName(true) + '"></span>';
			}
			if (i % 3 === 2) pokemonhtml += '</div><div class="teamicons">';
		}
		pokemonhtml = '<div class="teamicons">' + pokemonhtml + '</div>';
		if (this.n === 1) {
			if (this.initialized) {
				this.battle.rightbarElem.html('<div class="trainer"><strong>' + Tools.escapeHTML(this.name) + '</strong><div class="trainersprite" username="' + Tools.escapeHTML(this.name) + '" style="background-image:url(' + Tools.resolveAvatar(this.spriteid) + ')"></div>' + pokemonhtml + '</div>').find('.trainer').css('opacity', 1);
			} else {
				this.battle.rightbarElem.find('.trainer').css('opacity', 0.4);
			}
		} else {
			if (this.initialized) {
				this.battle.leftbarElem.html('<div class="trainer"><strong>' + Tools.escapeHTML(this.name) + '</strong><div class="trainersprite" username="' + Tools.escapeHTML(this.name) + '" style="background-image:url(' + Tools.resolveAvatar(this.spriteid) + ')"></div>' + pokemonhtml + '</div>').find('.trainer').css('opacity', 1);
			} else {
				this.battle.leftbarElem.find('.trainer').css('opacity', 0.4);
			}
		}
	};

	UserPopup.prototype.update = function (data) {
		if (data && data.userid === this.data.userid) {
			data = _.extend(this.data, data);
			UserPopup.dataCache[data.userid] = data;
		} else {
			data = this.data;
		}
		var userid = data.userid;
		var name = data.name;
		var avatar = data.avatar || '';
		var groupDetails = {
			'#': "Room Owner (#)",
			'~': "Administrator (~)",
			'&': "Leader (&amp;)",
			'@': "Moderator (@)",
			'%': "Driver (%)",
			'\u2605': "Player (\u2605)",
			'+': "Voiced (+)",
			'‽': "<span style='color:#777777'>Locked (‽)</span>",
			'!': "<span style='color:#777777'>Muted (!)</span>"
		};
		var group = (groupDetails[name.substr(0, 1)] || '');
		if (group || name.charAt(0) === ' ') name = name.substr(1);
		var ownUserid = app.user.get('userid');

		var buf = '<div class="userdetails">';
		if (avatar) buf += '<img username="'+userid+'" class="trainersprite' + (userid === ownUserid ? ' yours' : '') + '" src="' + Tools.resolveAvatar(avatar) + '" />';
		buf += '<strong><a href="//pokemonshowdown.com/users/' + userid + '" target="_blank">' + Tools.escapeHTML(name) + '</a></strong><br />';
		buf += '<small>' + (group || '&nbsp;') + '</small>';
		if (data.rooms) {
			var battlebuf = '';
			var chatbuf = '';
			for (var i in data.rooms) {
				if (i === 'global') continue;
				var roomid = toRoomid(i);
				if (roomid.substr(0, 7) === 'battle-') {
					var p1 = data.rooms[i].p1.substr(1);
					var p2 = data.rooms[i].p2.substr(1);
					if (!battlebuf) battlebuf = '<br /><em>Battles:</em> ';
					else battlebuf += ', ';
					var ownBattle = (ownUserid === toUserid(p1) || ownUserid === toUserid(p2));
					battlebuf += '<span title="' + (Tools.escapeHTML(p1) || '?') + ' v. ' + (Tools.escapeHTML(p2) || '?') + '"><a href="' + app.root + roomid + '" class="ilink' + ((ownBattle || app.rooms[i]) ? ' yours' : '') + '">' + roomid.substr(7) + '</a></span>';
				} else {
					if (!chatbuf) chatbuf = '<br /><em>Chatrooms:</em> ';
					else chatbuf += ', ';
					chatbuf += '<a href="' + app.root + roomid + '" class="ilink' + (app.rooms[i] ? ' yours' : '') + '">' + roomid + '</a>';
				}
			}
			buf += '<small class="rooms">' + battlebuf + chatbuf + '</small>';
		} else if (data.rooms === false) {
			buf += '<strong class="offline">OFFLINE</strong>';
		}
		buf += '</div>';

		buf += '<p class="buttonbar">';
		if (userid === app.user.get('userid') || !app.user.get('named')) {
			buf += '<button disabled>Challenge</button> <button disabled>Chat</button>';
			if (userid === app.user.get('userid')) {
				buf += '</p><hr /><p class="buttonbar" style="text-align: right">';
				buf += '<button name="login"><i class="fa fa-pencil"></i> Change name</button> <button name="logout"><i class="fa fa-power-off"></i> Log out</button>';
			}
		} else {
			buf += '<button name="challenge">Challenge</button> <button name="pm">Chat</button> <button name="userOptions">\u2026</button>';
		}
		buf += '</p>';

		this.$el.html(buf);
	}
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);