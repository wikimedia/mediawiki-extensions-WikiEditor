<?php

declare( strict_types=1 );

namespace MediaWiki\Extension\WikiEditor\Tests\Integration;

use MediaWiki\Context\RequestContext;
use MediaWiki\Extension\WikiEditor\Hooks;
use MediaWiki\Page\Article;
use MediaWiki\Registration\ExtensionRegistry;
use MediaWiki\Request\FauxRequest;
use MediaWiki\Tests\User\TempUser\TempUserTestTrait;
use MediaWiki\Title\Title;
use MediaWikiIntegrationTestCase;
use MockHttpTrait;
use Wikimedia\TestingAccessWrapper;

/**
 * @covers \MediaWiki\Extension\WikiEditor\Hooks
 * @group Database
 */
class HooksTest extends MediaWikiIntegrationTestCase {

	use MockHttpTrait;
	use TempUserTestTrait;

	private function newHooks(): Hooks {
		$services = $this->getServiceContainer();
		return new Hooks(
			ExtensionRegistry::getInstance(),
			$services->getFormatterFactory(),
			$services->getMainConfig(),
			$services->getUserEditTracker(),
			$services->getUserGroupManager(),
			$services->getUserOptionsLookup(),
			null
		);
	}

	private function buildEventData( Hooks $hooks, $user, string $sessionId ): array {
		$title = Title::makeTitle( NS_MAIN, 'WikiEditorHooksTest' );
		$context = new RequestContext();
		$context->setUser( $user );
		$context->setTitle( $title );
		$article = Article::newFromTitle( $title, $context );

		return TestingAccessWrapper::newFromObject( $hooks )->buildEditAttemptStepEventData(
			'init',
			$article,
			false,
			[ 'editing_session_id' => $sessionId ]
		);
	}

	public function testBuildEditAttemptStepEventDataForAutoconfirmedUser(): void {
		$user = $this->getTestUser( [ 'autoconfirmed' ] )->getUser();
		$data = $this->buildEventData( $this->newHooks(), $user, 'test-session' );

		$this->assertArrayHasKey( 'user_groups', $data );
		$this->assertContains( 'autoconfirmed', $data['user_groups'] );
		$this->assertContains( 'user', $data['user_groups'] );
	}

	public function testBuildEditAttemptStepEventDataForTemporaryAccount(): void {
		// Temp-user creation queues a DeferredUpdate that hits the IPReputation
		// IPoid service over HTTP; install a stub response so the
		// NullHttpRequestFactory assertion doesn't fail the test.
		$this->installMockHttp( '' );
		$this->enableAutoCreateTempUser();
		$tempUser = $this->getServiceContainer()
			->getTempUserCreator()
			->create( null, new FauxRequest() )
			->getUser();

		$data = $this->buildEventData( $this->newHooks(), $tempUser, 'test-session-temp' );

		$this->assertTrue( $data['user_is_temp'] );
		$this->assertContains( 'temp', $data['user_groups'] );
		$this->assertNotContains( 'autoconfirmed', $data['user_groups'] );
	}
}
