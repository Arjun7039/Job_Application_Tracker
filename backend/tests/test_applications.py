def get_token(client, email="appuser@example.com"):
    client.post("/api/auth/register", json={
        "name": "App User",
        "email": email,
        "password": "password123"
    })
    resp = client.post("/api/auth/login", json={
        "email": email,
        "password": "password123"
    })
    return resp.json()["access_token"]

def test_application_crud(client):
    token = get_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # Create application
    create_resp = client.post("/api/applications", headers=headers, json={
        "company": "Stripe",
        "position": "Software Engineer",
        "location": "Remote",
        "job_type": "full_time",
        "status": "applied",
        "notes": "Referred"
    })
    assert create_resp.status_code == 201
    app_data = create_resp.json()
    app_id = app_data["id"]
    assert app_data["company"] == "Stripe"

    # List applications
    list_resp = client.get("/api/applications", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1

    # Update application status
    update_resp = client.put(f"/api/applications/{app_id}", headers=headers, json={
        "status": "interview"
    })
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "interview"

    # Dashboard stats
    stats_resp = client.get("/api/dashboard/stats", headers=headers)
    assert stats_resp.status_code == 200
    assert stats_resp.json()["interview"] == 1

    # Delete application
    del_resp = client.delete(f"/api/applications/{app_id}", headers=headers)
    assert del_resp.status_code == 204
