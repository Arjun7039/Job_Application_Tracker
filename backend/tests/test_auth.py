def test_register_and_login(client):
    # Register user
    reg_resp = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "secretpassword"
    })
    assert reg_resp.status_code in [200, 201]
    data = reg_resp.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

    # Login user
    login_resp = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "secretpassword"
    })
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data

    # Fetch user profile
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["name"] == "Test User"

def test_duplicate_registration(client):
    user_payload = {
        "name": "Test User",
        "email": "dup@example.com",
        "password": "secretpassword"
    }
    client.post("/api/auth/register", json=user_payload)
    resp = client.post("/api/auth/register", json=user_payload)
    assert resp.status_code == 400
