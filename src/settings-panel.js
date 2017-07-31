'use strict';

const { getClasses } = require('./helpers.js');

const {
	SETTINGS_CLASSES,
	SIDEBAR_BUTTON_CLASS,
	HEADER_CLASSES,
	SERVER_CARD_CLASSES,
} = require('./classes.js');

const { TRANSLATION_MODULE } = require('./constants.js');

const Settings = require('./settings.js');
const Server = require('./server.js');

const serverCard = require('./serverCard.js');
const checkbox = require('./checkbox.js');

function buildSidebarEntry() {
	const $entry = $('<span/>');

	const $button = $('<div/>')
		.addClass(SETTINGS_CLASSES.itemDefault)
		.addClass(SIDEBAR_BUTTON_CLASS)
		.html('Better Emojis');

	$button.mousedown(function () {
		const $this = $(this);

		// Make all selected items unselected
		changeClasses(SETTINGS_CLASSES.itemBrandSelected, SETTINGS_CLASSES.itemBrand);
		changeClasses(SETTINGS_CLASSES.itemDefaultSelected, SETTINGS_CLASSES.itemDefault);
		changeClasses(SETTINGS_CLASSES.itemDangerSelected, SETTINGS_CLASSES.itemDanger);

		// Make self selected
		$this.removeClass(SETTINGS_CLASSES.itemDefault).addClass(SETTINGS_CLASSES.itemDefaultSelected);
	});

	$entry.append($button).append($('<div/>').addClass(SETTINGS_CLASSES.separator));

	return { $entry, $button };
}

function changeClasses(from, to, parent = null) {
	const classes = `.${from.split(' ').join('.')}`;
	return (parent == null ? $(classes) : $(parent).find(classes)).removeClass(from).addClass(to);
}

function buildServerCards() {
	const guildsIcons = getServersIcons();

	const $serverSortable = $('<div class="be-server-sortable"></div>');

	const servers = Server.getAllServers();

	for (const server of servers) {
		if (server.isGuild())
			$serverSortable.append(serverCard(server, guildsIcons));
	}

	const serversAccordion = UIkit.accordion($serverSortable, {
		duration: 150,
		targets: '> .be-accordion-item',
		toggle: '> .be-accordion-title',
		content: '> .be-accordion-data',
	});

	UIkit.sortable($serverSortable, {
		animation: 150,
		'cls-item': SERVER_CARD_CLASSES.serverCard,
	});

	$serverSortable.on('start', function (event, sortable, target, dragged) {
		// console.log(arguments);
		if (target.hasClass('uk-open')) {
			serversAccordion.toggle(target, false);
			dragged.css({ height: target.outerHeight() });
		}
	});

	$serverSortable.on('beforeshow', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.open');
	});

	$serverSortable.on('hidden', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.close');
	});

	$serverSortable.on('change', function (event, sortable, target) {
		const $children = sortable.$el.children();
		const out = [];
		out.length = $children.length;

		for (let i = 0; i < $children.length; i++) {
			out[i] = $($children[i]).data('server-id');
		}

		Settings.set('picker.serversorder', out);
	});

	return $serverSortable;
}

function buildContentColumn() {
	const $column = $(`
	<div class="content-column default"><div>
		<div class="better-emojis-settings">
			<h2 class="${getClasses(HEADER_CLASSES, ['h2', 'defaultColor', 'defaultMarginh2'])}">
					Better Emojis
				</h2>
				<div class="flex-vertical">
					
				</div>
		</div>
	</div></div>
	`);

	const $contentDiv = $column.find('.flex-vertical');

	$contentDiv.append(checkbox({
		setting: 'enabled',
		name: 'Enabled',
		description: 'Enable or disable this plugin',
		value: Settings.get('enabled'),
		change: (value) => {
			Settings.set('enabled', value);
			updateHiddenServers();
		}
	}));

	$contentDiv.append(buildServerCards());

	return $column;
}

const SERVER_REGEX = /\/channels\/(\d+)\/\d+/;
const BACKGOUND_URL_REGEX = /background-image: url\("(.*)"\);/;

function getServersIcons() {
	const guildsIcons = {};

	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		guildsIcons[`${match[1]}`] = BACKGOUND_URL_REGEX.exec($avatar.attr('style'))[1];
		return guild;
	});

	return guildsIcons;
}

function injectPanel(layer) {
	const $layer = $(layer);

	const { $entry, $button } = buildSidebarEntry();
	const $contentColumn = buildContentColumn().hide();
	const $contentRegion = $layer.find('.content-region-scroller');

	$contentRegion.prepend($contentColumn);

	$layer.find('.sidebar > div')
		.children()
		.mousedown(() => {
			$contentRegion.find('.content-column').show();
			$contentColumn.hide();
			$button.removeClass(SETTINGS_CLASSES.itemDefaultSelected).addClass(SETTINGS_CLASSES.itemDefault);
		})
		.filter((index, element) => $(element).text() === TRANSLATION_MODULE.Messages.CHANGE_LOG)
		.before($entry);

	$button.mousedown(() => {
		$contentRegion.find('.content-column').hide();
		$contentColumn.show();
	});
}

function updateHiddenServers() {
	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		const server = Server.getById(match[1]);

		if (!server) {
			console.log(match);
			return guild;
		}

		if (server.isShownInList() || !Settings.get('enabled', true)) {
			$(guild).removeAttr('style');
		} else {
			$(guild).animate({ width: 0, height: 0 }, 500, 'swing', function () {
				$(this).hide();
			});
		}

		return guild;
	});
}

exports.updateHiddenServers = updateHiddenServers;

exports.inject = injectPanel;
