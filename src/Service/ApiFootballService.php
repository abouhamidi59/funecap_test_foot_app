<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiFootballService
{
    private HttpClientInterface $client;
    private string $apiKey;

    public function __construct(HttpClientInterface $client, $apiKey)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }

    /**
     * @throws \Exception|TransportExceptionInterface
     */
    public function fetchFromApi(string $endpoint, array $params = [])
    {
        $response = $this->client->request('GET', 'https://api-football-v1.p.rapidapi.com/v3/' . $endpoint, [
            'headers' => [
                'X-RapidAPI-Host' => 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key' => $this->apiKey
            ],
            'query' => $params,
        ]);

        if ($response->getStatusCode() != Response::HTTP_OK) {
            throw new \Exception('Une erreur est survenue lors de la requête à l\'API : ' . $response->getContent(false));
        }

        return json_decode($response->getContent(), true);
    }

    /**
     * @throws \Exception|TransportExceptionInterface
     */
    public function getLeaguesByCountryCode(string $countryCode)
    {
        $endpoint = 'leagues';
        $params = ['code' => $countryCode];

        $response = $this->fetchFromApi($endpoint, $params);

        if ($response['results'] > 0) {
            return $response['response'];
        } else {
            throw new \Exception("Leagues not found for country code: {$countryCode}");
        }
    }

    /**
     * @throws \Exception|TransportExceptionInterface
     */
    public function getMatchesByLeague(int $leagueId)
    {
        try {
            $response = $this->fetchFromApi('fixtures', [
                'league' => $leagueId,
                'season'=> 2022
            ]);

            if ($response['results'] > 0) {
                return $response['response'];
            } else {
                throw new \Exception("Match not found");
            }
        } catch (\Exception $e) {
            throw new \Exception("Error: " . $e->getMessage());
        }
    }

    /**
     * @throws \Exception|TransportExceptionInterface
     */
    public function getMatchDetails(int $id)
    {
        $endpoint = 'fixtures';
        $params = ['id' => $id];

        try {
            $response = $this->fetchFromApi($endpoint, $params);

            if ($response['results'] > 0 && isset($response['response'][0])) {
                $match = $response['response'][0];

                $statsResponse = $this->fetchFromApi('fixtures/statistics', ['fixture' => $match['fixture']['id']]);
                $match['stats'] = $statsResponse['response'];

                return $match;
            } else {
                throw new \Exception("Match not found");
            }
        } catch (\Exception $e) {
            throw new \Exception("Error: " . $e->getMessage());
        }
    }


    /**
     * @throws \Exception|TransportExceptionInterface
     */
    public function getHeadToHeadMatches(int $team1Id, int $team2Id)
    {
        $endpoint = 'fixtures/headtohead';
        $params = [
            'h2h' => "{$team1Id}-{$team2Id}",
            'last' => 5
        ];

        try {
            $response = $this->fetchFromApi($endpoint, $params);
            return $response['response'];

        } catch (\Exception $e) {
            throw new \Exception("Error: " . $e->getMessage());
        }
    }

}
