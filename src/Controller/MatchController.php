<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\ApiFootballService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MatchController extends AbstractController
{
    private ApiFootballService $apiFootballService;


    public function __construct(apiFootballService $apiFootballService)
    {
        $this->apiFootballService = $apiFootballService;
    }

    #[Route('/', name: 'home', methods: ['GET'])]
    public function index(): Response
    {
        $leagueId = 61;
        $leagues = $this->apiFootballService->getLeaguesByCountryCode('FR');
        $matches = $this->apiFootballService->getMatchesByLeague($leagueId);

        return $this->render('index.html.twig', [
            'leagues' => $leagues,
            'matches' => $matches,
            'leagueId'  => $leagueId
        ]);
    }

    #[Route('/matches/{leagueId}', name: 'matches_by_league', methods: ['GET'])]
    public function matchesByLeague(int $leagueId): JsonResponse
    {
        try {
            $matches = $this->apiFootballService->getMatchesByLeague($leagueId);
            return new JsonResponse(['matches' => $matches]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/match/{id}', name: 'match_details', methods: ['GET'])]
    public function matchDetails(int $id): JsonResponse
    {
        try {
            $match = $this->apiFootballService->getMatchDetails($id);
            return new JsonResponse(['match' => $match]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

}
