<?php

$cfg = require __DIR__ . '/../vendor/mediawiki/mediawiki-phan-config/src/config.php';

$cfg['directory_list'] = array_merge(
	$cfg['directory_list'],
	[
		'../../extensions/EventLogging',
		'../../extensions/MobileFrontend',
		'../../extensions/WikimediaEvents',
		'../../extensions/ConfirmEdit',
	]
);

$cfg['exclude_analysis_directory_list'] = array_merge(
	$cfg['exclude_analysis_directory_list'],
	[
		'../../extensions/EventLogging',
		'../../extensions/MobileFrontend',
		'../../extensions/WikimediaEvents',
		'../../extensions/ConfirmEdit',
	]
);

return $cfg;
