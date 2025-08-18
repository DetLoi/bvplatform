# Clear all seeded data and create clean admin user
$API_BASE = "http://localhost:5000/api"

Write-Host "CLEANING DATABASE VIA API:" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Get current users
Write-Host "`nCurrent users:" -ForegroundColor Yellow
$usersResponse = Invoke-RestMethod -Uri "$API_BASE/users" -Method Get
Write-Host "Found $($usersResponse.users.Count) users" -ForegroundColor White

# Delete all existing users
Write-Host "`nDeleting all existing users..." -ForegroundColor Red
foreach ($user in $usersResponse.users) {
    try {
        Invoke-RestMethod -Uri "$API_BASE/users/$($user._id)" -Method Delete
        Write-Host "Deleted user: $($user.username)" -ForegroundColor White
    } catch {
        Write-Host "Failed to delete user: $($user.username)" -ForegroundColor Red
    }
}

# Get current badges
Write-Host "`nCurrent badges:" -ForegroundColor Yellow
try {
    $badgesResponse = Invoke-RestMethod -Uri "$API_BASE/badges" -Method Get
    Write-Host "Found $($badgesResponse.badges.Count) badges" -ForegroundColor White
    
    # Delete all badges
    if ($badgesResponse.badges) {
        Write-Host "`nDeleting all badges..." -ForegroundColor Red
        foreach ($badge in $badgesResponse.badges) {
            try {
                Invoke-RestMethod -Uri "$API_BASE/badges/$($badge._id)" -Method Delete
                Write-Host "Deleted badge: $($badge.name)" -ForegroundColor White
            } catch {
                Write-Host "Failed to delete badge: $($badge.name)" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "No badges found or error accessing badges" -ForegroundColor Yellow
}

# Get current crews
Write-Host "`nCurrent crews:" -ForegroundColor Yellow
try {
    $crewsResponse = Invoke-RestMethod -Uri "$API_BASE/crews" -Method Get
    Write-Host "Found $($crewsResponse.crews.Count) crews" -ForegroundColor White
    
    # Delete all crews
    if ($crewsResponse.crews) {
        Write-Host "`nDeleting all crews..." -ForegroundColor Red
        foreach ($crew in $crewsResponse.crews) {
            try {
                Invoke-RestMethod -Uri "$API_BASE/crews/$($crew._id)" -Method Delete
                Write-Host "Deleted crew: $($crew.name)" -ForegroundColor White
            } catch {
                Write-Host "Failed to delete crew: $($crew.name)" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "No crews found or error accessing crews" -ForegroundColor Yellow
}

# Get current moves
Write-Host "`nCurrent moves:" -ForegroundColor Yellow
try {
    $movesResponse = Invoke-RestMethod -Uri "$API_BASE/moves" -Method Get
    Write-Host "Found $($movesResponse.moves.Count) moves" -ForegroundColor White
    
    # Delete all moves
    if ($movesResponse.moves) {
        Write-Host "`nDeleting all moves..." -ForegroundColor Red
        foreach ($move in $movesResponse.moves) {
            try {
                Invoke-RestMethod -Uri "$API_BASE/moves/$($move._id)" -Method Delete
                Write-Host "Deleted move: $($move.name)" -ForegroundColor White
            } catch {
                Write-Host "Failed to delete move: $($move.name)" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "No moves found or error accessing moves" -ForegroundColor Yellow
}

# Get current events
Write-Host "`nCurrent events:" -ForegroundColor Yellow
try {
    $eventsResponse = Invoke-RestMethod -Uri "$API_BASE/events" -Method Get
    Write-Host "Found $($eventsResponse.events.Count) events" -ForegroundColor White
    
    # Delete all events
    if ($eventsResponse.events) {
        Write-Host "`nDeleting all events..." -ForegroundColor Red
        foreach ($event in $eventsResponse.events) {
            try {
                Invoke-RestMethod -Uri "$API_BASE/events/$($event._id)" -Method Delete
                Write-Host "Deleted event: $($event.title)" -ForegroundColor White
            } catch {
                Write-Host "Failed to delete event: $($event.title)" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "No events found or error accessing events" -ForegroundColor Yellow
}

# Create clean admin user
Write-Host "`nCreating clean admin user..." -ForegroundColor Green
$adminUserData = @{
    username = "admin"
    email = "admin@breakverse.com"
    password = "admin123"
    name = "Admin User"
    isAdmin = $true
    level = 1
    xp = 0
    masteredMoves = @()
    pendingMoves = @()
    badges = @()
    battleVideos = @()
    status = "active"
}

try {
    $createAdminResponse = Invoke-RestMethod -Uri "$API_BASE/users" -Method Post -Body ($adminUserData | ConvertTo-Json -Depth 10) -ContentType "application/json"
    Write-Host "Admin user created successfully!" -ForegroundColor Green
    Write-Host "Username: admin" -ForegroundColor White
    Write-Host "Password: admin123" -ForegroundColor White
    Write-Host "Email: admin@breakverse.com" -ForegroundColor White
    Write-Host "Level: $($createAdminResponse.level)" -ForegroundColor White
    Write-Host "XP: $($createAdminResponse.xp)" -ForegroundColor White
    Write-Host "Mastered Moves: $($createAdminResponse.masteredMoves.Count)" -ForegroundColor White
} catch {
    Write-Host "Failed to create admin user" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nDatabase cleaned and ready!" -ForegroundColor Green
Write-Host "You can now log in with:" -ForegroundColor White
Write-Host "Username: admin" -ForegroundColor Cyan
Write-Host "Password: admin123" -ForegroundColor Cyan
Write-Host "`nThe leveling system will work as follows:" -ForegroundColor Yellow
Write-Host "- Users start at level 1 with 0 XP" -ForegroundColor White
Write-Host "- Level increases based on mastered moves and XP" -ForegroundColor White
Write-Host "- When users add moves, their level will auto-correct" -ForegroundColor White 