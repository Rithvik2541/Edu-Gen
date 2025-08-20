import requests
import json
from app.schemas.content import GenerateRequest

def test_generate_content():
    """Test the content generation API endpoint"""
    
    # Create the GenerateRequest object
    request_data = GenerateRequest(
        video_url="https://www.youtube.com/watch?v=NuIpZoQwuVY",
        content_type="quiz",
        difficulty="Intermediate"
    )
    
    # Convert to dict for JSON serialization
    request_dict = request_data.model_dump()
    
    print("Testing API with the following request:")
    print(json.dumps(request_dict, indent=2))
    print("\n" + "="*50 + "\n")
    
    # Make the API request
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/generate/",
            json=request_dict,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success! Generated content:")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Error details: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the FastAPI server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_generate_content()
