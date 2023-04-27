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
                    <td><img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="logo" /></td>
                    <td class="fs-5 fw-bold">${match.goals.home} <span class="fw-light">VS</span> ${match.goals.away}</td>
                    <td><img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="logo" /></td>
                    <td><a href="#" class="btn btn-primary" data-action="click->match#showDetails" data-match-id="${match.fixture.id}">Details</a></td>
                `;
                this.matchesContainerTarget.appendChild(tr);
            });
        } else {
            const errorData = await response.json();
            console.log(`Error: ${errorData.error}`);
        }
    }

    async showDetails(event) {
        event.preventDefault();
        const matchId = event.currentTarget.dataset.matchId;
        const response = await fetch(`/match/${matchId}`);

        if (response.ok) {
            const data = await response.json();
            const formattedDate = new Date(data.match.fixture.date).toLocaleString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            this.matchDetailsContainerTarget.innerHTML = `
            <div class="card">
                <div class="card-header">
                     <h5 class="card-title">Match Details</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        Date: ${formattedDate}<br>
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
