using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyTODO_API.Controllers;
using MyTODO_API.Data;
using MyTODO_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace MyTODO_API.Tests.Controllers
{
    public class AuthControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "AuthTestDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        private IConfiguration GetMockConfiguration()
        {
            var config = new Dictionary<string, string?>
            {
                { "Jwt:Key", "testsecretkey1234567890" },
                { "Jwt:Issuer", "testissuer" },
                { "Jwt:Audience", "testaudience" }
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(config)
                .Build();
        }

        [Fact]
        public void Register_ReturnsOk_WhenUserIsNew()
        {
            var context = GetInMemoryDbContext();
            var controller = new AuthController(context, GetMockConfiguration());

            var newUser = new User
            {
                Username = "testuser",
                PasswordHash = "plainPassword",
                Email = "test@example.com"
            };

            var result = controller.Register(newUser);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            var context = GetInMemoryDbContext();
            var controller = new AuthController(context, GetMockConfiguration());

            var loginUser = new User
            {
                Username = "nonexistent",
                Email = "nonexistent@example.com",
                PasswordHash = "wrong"
            };

            var result = controller.Login(loginUser);

            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}
