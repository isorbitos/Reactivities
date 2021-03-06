﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class IsHostRequirement :IAuthorizationRequirement
    {
    }

    public class IsHostRequiremenHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsHostRequiremenHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var curentUsername = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            var activity = _context.Activities.FindAsync(activityId).Result;

            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);
            if (host?.AppUser?.UserName == curentUsername)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
