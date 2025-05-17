using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyTODO_API.Controllers;
using MyTODO_API.Data;
using MyTODO_API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace MyTODO_API.Tests.Controllers
{
    public class UsersControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "UsersTestDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_IfUserDoesNotExist()
        {
            var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var result = await controller.GetUser(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostUser_CreatesUser()
        {
            var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var user = new User
            {
                Username = "new",
                PasswordHash = "hash",
                Email = "user@example.com"
            };

            var result = await controller.PostUser(user);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedUser = Assert.IsType<User>(created.Value);

            Assert.Equal("new", returnedUser.Username);
            Assert.Equal("user@example.com", returnedUser.Email);
        }

        [Fact]
        public async Task PutUser_ReturnsBadRequest_WhenIdMismatch()
        {
            var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var user = new User
            {
                Id = 2,
                Username = "mismatch",
                PasswordHash = "hash",
                Email = "mismatch@example.com"
            };

            var result = await controller.PutUser(1, user);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task DeleteUser_RemovesUser_WhenExists()
        {
            var context = GetInMemoryDbContext();
            var user = new User
            {
                Id = 1,
                Username = "delete",
                PasswordHash = "hash",
                Email = "del@example.com"
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var controller = new UsersController(context);

            var result = await controller.DeleteUser(1);

            Assert.IsType<NoContentResult>(result);
            Assert.False(context.Users.Any(u => u.Id == 1));
        }

        [Fact]
        public async Task DeleteUser_ReturnsNotFound_WhenNotExists()
        {
            var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var result = await controller.DeleteUser(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
