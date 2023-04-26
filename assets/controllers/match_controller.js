import { Controller } from 'stimulus';

export default class extends Controller {
    static targets = ['matchesContainer', 'matchDetailsContainer'];

    async loadMatches(event) {
        event.preventDefault();
        const leagueId = event.currentTarget.dataset.leagueId;
        const response = await fetch(`/matches/${leagueId}`);

        if (response.ok) {
            const data = await response.json();
            this.matchesContainerTarget.innerHTML = '';
            data.matches.forEach(match => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
            <td>${match.teams.home.name}</td>
            <td>${match.teams.away.name}</td>
            <td><a href="#" data-action="click->match#showDetails" data-match-id="${match.fixture.id}">Details</a></td>
        `;
                this.matchesContainerTarget.appendChild(tr);
            });
        } else {
            const errorData = await response.json();
            console.log(`Error: ${errorData.error}`);
        }
    }

    /*async showDetails(event) {
        event.preventDefault();
        const matchId = event.currentTarget.dataset.matchId;
        const response = await fetch(`/match/${matchId}`);

        if (response.ok) {
            const data = await response.json();
            console.log(data.match)
            this.matchDetailsContainerTarget.innerHTML = `
            <div class="card">
                <div class="card-header">
                    ${data.match.goals.home} VS ${data.match.goals.away}
                </div>
                <div class="card-body">
                    <h5 class="card-title">Match Details</h5>
                    <p class="card-text">
                        Date: ${data.match.fixture.date}<br>
                        Venue: ${data.match.fixture.venue.name +' - '+ data.match.fixture.venue.city}<br>
                        Referee: ${data.match.fixture.referee}<br>
                    </p>
                </div>
            </div>
        `;
            this.matchDetailsContainerTarget.hidden = false;
        } else {
            const errorData = await response.json();
            console.log( errorData.error);
        }
    }*/

    async showDetails(event) {
        event.preventDefault();
        const matchId = event.currentTarget.dataset.matchId;
        const response = await fetch(`/match/${matchId}`);

        if (response.ok) {
            const data = await response.json();
            console.log(data.match)
            this.matchDetailsContainerTarget.innerHTML = `
            <div class="card">
                <div class="card-header">
                    ${data.match.goals.home} VS ${data.match.goals.away}
                </div>
                <div class="card-body">
                    <h5 class="card-title">Match Details</h5>
                    <p class="card-text">
                        Date: ${data.match.fixture.date}<br>
                        Venue: ${data.match.fixture.venue.name +' - '+ data.match.fixture.venue.city}<br>
                        Referee: ${data.match.fixture.referee}<br>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h5>${data.match.teams.home.name} Stats:</h5>
                    ${data.match.stats[0].statistics.map(stat => `
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-0">${stat.type}</p>
                            <div class="progress" style="width: 70%;">
                                <div class="progress-bar" role="progressbar" style="width: ${stat.value}%" aria-valuenow="${stat.value}" aria-valuemin="0" aria-valuemax="100">${stat.value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="col-md-6">
                    <h5>${data.match.teams.away.name} Stats:</h5>
                    ${data.match.stats[1].statistics.map(stat => `
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-0">${stat.type}</p>
                            <div class="progress" style="width: 70%;">
                                <div class="progress-bar" role="progressbar" style="width: ${stat.value}%" aria-valuenow="${stat.value}" aria-valuemin="0" aria-valuemax="100">${stat.value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
            this.matchDetailsContainerTarget.hidden = false;
        } else {
            const errorData = await response.json();
            console.log( errorData.error);
        }
    }

}
