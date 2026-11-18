# Migrant Community Platform --- Master Completion Checklist

**Purpose:** This is the single source of truth for tracking whether the
work identified across audit files 01--23 has actually been completed
and verified.

**Project:** Migrant Community Platform\
**Baseline audit date:** 16 November 2026\
**Last consolidated source audit:** `23_FINAL_SOURCE_OF_TRUTH_AUDIT.md`

------------------------------------------------------------------------

## How to use this checklist

-   Change `[ ]` to `[x]` only after the task is completed and the
    required verification has passed.
-   A code change alone does not mean a task is complete. Run the
    relevant test.
-   Use the status labels consistently:
    -   **PASS** --- executed and verified successfully.
    -   **FAIL** --- executed and failed.
    -   **IN PROGRESS** --- currently being worked on.
    -   **BLOCKED** --- cannot proceed because of a documented
        dependency.
    -   **NOT RUN** --- verification has not been executed.
    -   **ACCEPTED** --- intentionally deferred or accepted as a known
        limitation.
    -   **NOT APPLICABLE** --- genuinely not applicable; explain why.
-   Record evidence: command, test name, endpoint, browser flow,
    screenshot reference, or commit.
-   Do not mark static code inspection as runtime verification.
-   Keep this file updated whenever work is completed. Do not create
    another audit/report file for routine progress.

### Overall progress

  Metric                                       Count
  ------------------------ -------------------------
  Total checklist items      Update during execution
  Completed and verified                           0
  In progress                                      0
  Blocked                                          0
  Not run / pending          Update during execution
  Accepted limitations       Update during execution

**Current overall release status:** NOT READY --- live API, browser E2E,
responsive runtime and full runtime security checks were not completed
in the source audit.

------------------------------------------------------------------------

# 1. Project architecture and frontend foundation

  ----------------------------------------------------------------------------------
  Done           ID             Checklist item       Initial source Evidence / notes
                                                     status         
  -------------- -------------- -------------------- -------------- ----------------
  \[x\]          ARCH-01        React 18 + Vite      PASS ---       JavaScript/JSX
                                frontend             source audit   
                                architecture                        
                                retained                            

  \[x\]          ARCH-02        Java 21 + Spring     PASS ---       Do not replace
                                Boot backend         source audit   backend
                                retained                            

  \[x\]          ARCH-03        PostgreSQL/PostGIS   PASS ---       Verify current
                                retained as database environment    environment
                                                     report         again

  \[x\]          ARCH-04        Frontend and backend PASS ---       
                                remain separate      source audit   
                                applications                        

  \[x\]          ARCH-05        No TypeScript        PASS ---       
                                introduced into      source audit   
                                frontend                            

  \[x\]          ARCH-06        No Firebase,         PASS ---       
                                Supabase, Node       source audit   
                                backend or mock                     
                                production API                      
                                introduced                          

  \[ \]          ARCH-07        Confirm current Git  NOT RUN        
                                working tree and                    
                                preserve all                        
                                existing user                       
                                changes                             

  \[ \]          ARCH-08        Confirm frontend and NOT RUN        
                                backend environment                 
                                configuration is                    
                                correct                             

  \[ \]          ARCH-09        Confirm production   NOT RUN        
                                build and deployment                
                                configuration,                      
                                including SPA                       
                                fallback for nested                 
                                routes                              
  ----------------------------------------------------------------------------------

# 2. Routing and bug remediation

The source audit reports these fixes as present in source code. Re-run
relevant tests against the current checkout before release.

  -----------------------------------------------------------------------------------
  Done           ID             Checklist item         Initial source  Evidence /
                                                       status          notes
  -------------- -------------- ---------------------- --------------- --------------
  \[x\]          BUG-01         User routes use `/app` PASS --- source 
                                prefix and admin       verified        
                                routes use `/admin`                    
                                prefix                                 

  \[x\]          BUG-02         Reset-password schema  PASS --- source 
                                declares and validates verified        
                                `confirmPassword`                      

  \[x\]          BUG-03         Language response      PASS --- source 
                                exposes an ID and      verified        
                                onboarding/settings                    
                                persist languages                      

  \[x\]          BUG-04         Post comments, share   PASS --- source 
                                action and report      verified        
                                dialog are implemented                 

  \[x\]          BUG-05         Profile image URL is   PASS --- source Runtime image
                                absolute and image GET verified        load still
                                route supports browser                 needs testing
                                image retrieval                        

  \[x\]          BUG-06         Settings supports      PASS --- source 
                                adding/removing        verified        
                                interests and                          
                                languages                              

  \[x\]          BUG-07         Messaging uses a       PASS --- source Runtime
                                single-pane layout on  verified        responsive
                                mobile                                 test pending

  \[x\]          BUG-08         Connections messaging  PASS --- source 
                                navigation uses        verified        
                                client-side navigation                 

  \[x\]          BUG-09         Invalid/duplicate      PASS --- source 
                                Tailwind sidebar       verified        
                                classes removed                        

  \[x\]          BUG-10         PostCard like state    PASS --- source 
                                stays synchronized     verified        
                                when post data changes                 

  \[x\]          BUG-11         Stray repository-root  PASS --- source 
                                `nul` file removed     verified        

  \[x\]          BUG-12         Not-found page is      PASS --- source 
                                rendered inside the    verified        
                                public layout                          

  \[x\]          BUG-13         Google sign-in button  PASS --- source 
                                is responsive on       verified        
                                narrow screens                         

  \[x\]          BUG-14         Registration handles   PASS --- source Full live flow
                                tokenless/unverified   verified        still pending
                                users and routes to                    
                                email verification                     

  \[x\]          BUG-15         Previously unused      PARTIAL         See remaining
                                service methods were   historically;   feature
                                reviewed and relevant  reconciled by   checklist
                                UI gaps addressed      later fixes     
  -----------------------------------------------------------------------------------

# 3. Route inventory and navigation verification

  ---------------------------------------------------------------------------------
  Done           ID             Checklist item        Initial status Evidence /
                                                                     notes
  -------------- -------------- --------------------- -------------- --------------
  \[ \]          ROUTE-01       Verify all public     NOT RUN in     
                                routes load: `/`,     live browser   
                                `/about`,                            
                                `/features`,                         
                                `/contact`, `/login`,                
                                `/register`,                         
                                `/verify-email`,                     
                                `/forgot-password`,                  
                                `/reset-password`,                   
                                `/privacy`, `/terms`                 

  \[ \]          ROUTE-02       Verify `/admin/login` NOT RUN in     
                                remains publicly      live browser   
                                accessible                           

  \[ \]          ROUTE-03       Verify all user       NOT RUN in     
                                routes under `/app/*` live browser   
                                load after                           
                                authentication                       

  \[ \]          ROUTE-04       Verify all admin      NOT RUN in     
                                routes under          live browser   
                                `/admin/*` load after                
                                admin authentication                 

  \[ \]          ROUTE-05       Verify                NOT RUN in     
                                unauthenticated user  live browser   
                                is redirected to                     
                                login and returned to                
                                intended route after                 
                                login                                

  \[ \]          ROUTE-06       Verify admin route    NOT RUN at     
                                protection and        runtime        
                                backend role                         
                                enforcement                          

  \[ \]          ROUTE-07       Verify browser        NOT RUN        
                                refresh on nested                    
                                routes works with                    
                                deployment SPA                       
                                fallback                             

  \[ \]          ROUTE-08       Verify unknown routes NOT RUN in     
                                render the branded    live browser   
                                404 page                             

  \[ \]          ROUTE-09       Decide whether        OPEN --- UX    
                                authenticated         decision       
                                visitors to `/login`                 
                                or `/register` should                
                                be redirected to                     
                                `/app/home`                          
  ---------------------------------------------------------------------------------

# 4. API integration and live backend workflows

Static endpoint/controller/DTO matching was reported as PASS. The live
round-trip checklist below was mostly NOT RUN.

## 4.1 API infrastructure

  ---------------------------------------------------------------------------
  Done           ID             Checklist item  Initial status Evidence /
                                                               notes
  -------------- -------------- --------------- -------------- --------------
  \[x\]          API-01         Frontend API    PASS ---       
                                base URL and    static         
                                `/api` context  contract audit 
                                path contract                  
                                inspected                      

  \[x\]          API-02         API response    PASS ---       
                                envelope        static         
                                unwrapping and  contract audit 
                                pagination                     
                                normalization                  
                                inspected                      

  \[x\]          API-03         User and admin  PASS ---       
                                Axios           static         
                                clients/token   contract audit 
                                handling                       
                                inspected                      

  \[ \]          API-04         Confirm         NOT RUN        
                                frontend can                   
                                reach backend                  
                                from the                       
                                running browser                

  \[ \]          API-05         Verify CORS and NOT RUN        
                                OPTIONS                        
                                preflight from                 
                                the frontend                   
                                origin                         

  \[ \]          API-06         Verify real API NOT RUN        
                                response                       
                                payloads and                   
                                database                       
                                persistence,                   
                                not just                       
                                endpoint                       
                                matching                       

  \[ \]          API-07         Investigate     OPEN --- minor 
                                `/health`                      
                                returning 404;                 
                                remove dead                    
                                allow-list                     
                                entry or                       
                                implement a                    
                                health endpoint                
  ---------------------------------------------------------------------------

## 4.2 Authentication and account lifecycle

  ----------------------------------------------------------------------------------------
  Done           ID             Checklist item    Initial status            Evidence /
                                                                            notes
  -------------- -------------- ----------------- ------------------------- --------------
  \[ \]          AUTH-01        Register a new    NOT RUN                   
                                development test                            
                                user                                        

  \[ \]          AUTH-02        Verify duplicate  NOT RUN                   
                                email                                       
                                registration                                
                                behavior                                    

  \[ \]          AUTH-03        Complete email    BLOCKED/PENDING email     
                                verification with setup                     
                                a real or                                   
                                controlled test                             
                                token                                       

  \[ \]          AUTH-04        Verify invalid    NOT RUN                   
                                and expired email                           
                                verification                                
                                tokens                                      

  \[ \]          AUTH-05        Verify resend     NOT RUN                   
                                verification flow                           

  \[ \]          AUTH-06        Login with valid  NOT RUN                   
                                credentials                                 

  \[ \]          AUTH-07        Reject invalid    NOT RUN                   
                                credentials                                 
                                correctly                                   

  \[ \]          AUTH-08        Verify behavior   NOT RUN                   
                                when an                                     
                                unverified                                  
                                account attempts                            
                                login                                       

  \[ \]          AUTH-09        Verify            NOT RUN                   
                                access-token                                
                                refresh lifecycle                           

  \[ \]          AUTH-10        Verify logout     NOT RUN                   
                                clears the                                  
                                correct session                             

  \[ \]          AUTH-11        Complete          NOT RUN                   
                                forgot-password                             
                                request                                     

  \[ \]          AUTH-12        Complete          NOT RUN                   
                                reset-password                              
                                flow with a valid                           
                                token                                       

  \[ \]          AUTH-13        Verify            NOT RUN                   
                                invalid/expired                             
                                reset token and                             
                                password                                    
                                validation                                  

  \[ \]          AUTH-14        Verify login      NOT RUN                   
                                works with the                              
                                newly reset                                 
                                password                                    

  \[ \]          AUTH-15        Verify Google     NOT RUN /                 
                                OAuth when valid  configuration-dependent   
                                configuration is                            
                                available                                   
  ----------------------------------------------------------------------------------------

## 4.3 User profile, onboarding and settings

  ---------------------------------------------------------------------------------------
  Done           ID             Checklist item              Initial status Evidence /
                                                                           notes
  -------------- -------------- --------------------------- -------------- --------------
  \[ \]          PROF-01        Complete onboarding and     NOT RUN        
                                verify profile data                        
                                persists                                   

  \[ \]          PROF-02        Verify native language      NOT RUN        
                                persists and appears after                 
                                reload                                     

  \[ \]          PROF-03        Verify hometown and current NOT RUN        
                                location updates persist                   

  \[ \]          PROF-04        Verify profile photo upload NOT RUN        
                                and actual `<img>`                         
                                rendering                                  

  \[ \]          PROF-05        Verify interests can be     NOT RUN        
                                added and removed                          

  \[ \]          PROF-06        Verify languages can be     NOT RUN        
                                added and removed                          

  \[ \]          PROF-07        Verify privacy settings     NOT RUN        
                                persist after reload                       

  \[ \]          PROF-08        Resolve F-07: verify        OPEN           
                                whether                                    
                                `profileService.update()`                  
                                persists location fields;                  
                                use `updateLocation` if                    
                                required                                   
  ---------------------------------------------------------------------------------------

## 4.4 Discovery and connections

  ---------------------------------------------------------------------------
  Done           ID             Checklist item  Initial status Evidence /
                                                               notes
  -------------- -------------- --------------- -------------- --------------
  \[ \]          DISC-01        Verify people   NOT RUN        
                                discovery and                  
                                search                         

  \[ \]          DISC-02        Verify          NOT RUN        
                                hometown,                      
                                language and                   
                                interest                       
                                filters                        

  \[ \]          DISC-03        Send a          NOT RUN        
                                connection                     
                                request                        

  \[ \]          DISC-04        Accept and      NOT RUN        
                                reject                         
                                connection                     
                                requests                       

  \[ \]          DISC-05        Cancel outgoing NOT RUN        
                                request and                    
                                remove an                      
                                existing                       
                                connection                     

  \[ \]          DISC-06        Verify          NOT RUN        
                                connection                     
                                authorization                  
                                and state after                
                                reload                         
  ---------------------------------------------------------------------------

## 4.5 Communities and events

  --------------------------------------------------------------------------
  Done           ID             Checklist item Initial status Evidence /
                                                              notes
  -------------- -------------- -------------- -------------- --------------
  \[ \]          COMM-01        List, search   NOT RUN        
                                and view                      
                                community                     
                                details                       

  \[ \]          COMM-02        Join and leave NOT RUN        
                                a community                   

  \[ \]          COMM-03        Verify         NOT RUN        
                                community                     
                                members and                   
                                community feed                

  \[ \]          COMM-04        Verify         Source fix     
                                community feed PASS; runtime  
                                deep link      NOT RUN        
                                preselects the                
                                correct                       
                                community                     

  \[ \]          EVENT-01       List events    NOT RUN        
                                and view event                
                                details                       

  \[ \]          EVENT-02       Register and   NOT RUN        
                                unregister for                
                                an event                      

  \[ \]          EVENT-03       Verify         NOT RUN        
                                attendee                      
                                counts and                    
                                event capacity                
                                rules                         
  --------------------------------------------------------------------------

## 4.6 Feed, posts and uploads

  --------------------------------------------------------------------------------
  Done           ID             Checklist item     Initial status   Evidence /
                                                                    notes
  -------------- -------------- ------------------ ---------------- --------------
  \[ \]          FEED-01        Create a text post NOT RUN          

  \[ \]          FEED-02        Create a post with Source           
                                one or more        implementation   
                                uploaded images    PASS; runtime    
                                                   NOT RUN          

  \[ \]          FEED-03        Verify image       NOT RUN          
                                previews and                        
                                remove-image                        
                                behavior before                     
                                submission                          

  \[ \]          FEED-04        Edit and delete    Source           
                                own post           implementation   
                                                   PASS; runtime    
                                                   NOT RUN          

  \[ \]          FEED-05        Like and unlike a  NOT RUN          
                                post; verify count                  
                                and state                           

  \[ \]          FEED-06        Load, add and      Source           
                                delete comments    implementation   
                                                   PASS; runtime    
                                                   NOT RUN          

  \[ \]          FEED-07        Share a post and   Source           
                                verify deep-link   implementation   
                                scroll/highlight   PASS; runtime    
                                                   NOT RUN          

  \[ \]          FEED-08        Submit a content   Source           
                                report and verify  implementation   
                                moderation record  PASS; runtime    
                                                   NOT RUN          

  \[ \]          FEED-09        Verify image       Static security  
                                upload             PASS; runtime    
                                restrictions and   NOT RUN          
                                public image                        
                                retrieval                           
  --------------------------------------------------------------------------------

## 4.7 Messaging and notifications

  ---------------------------------------------------------------------------
  Done           ID             Checklist item  Initial status Evidence /
                                                               notes
  -------------- -------------- --------------- -------------- --------------
  \[ \]          MSG-01         Load            NOT RUN        
                                conversations                  
                                and message                    
                                history                        

  \[ \]          MSG-02         Send and        NOT RUN        
                                receive                        
                                messages                       

  \[ \]          MSG-03         Verify unread   NOT RUN        
                                message count                  

  \[ \]          MSG-04         Verify          NOT RUN        
                                conversation                   
                                membership and                 
                                message                        
                                authorization                  

  \[ \]          NOTIF-01       Load            NOT RUN        
                                notifications                  

  \[ \]          NOTIF-02       Mark            NOT RUN        
                                notification as                
                                read and verify                
                                unread count                   

  \[ \]          NOTIF-03       Delete          NOT RUN        
                                notification                   

  \[ \]          NOTIF-04       Verify navbar   NOT            
                                unread message  IMPLEMENTED in 
                                and             source audit   
                                notification                   
                                badges (F-01)                  
  ---------------------------------------------------------------------------

## 4.8 Administrator workflows

  --------------------------------------------------------------------------------
  Done           ID             Checklist item     Initial status   Evidence /
                                                                    notes
  -------------- -------------- ------------------ ---------------- --------------
  \[ \]          ADMIN-01       Admin login and    NOT RUN          
                                dashboard                           
                                statistics                          

  \[ \]          ADMIN-02       List users and     Source           
                                view user          implementation   
                                details/activity   PASS; runtime    
                                                   NOT RUN          

  \[ \]          ADMIN-03       Create, edit and   Source           
                                manage communities implementation   
                                                   PASS; runtime    
                                                   NOT RUN          

  \[ \]          ADMIN-04       Manage posts and   NOT RUN          
                                moderation reports                  

  \[ \]          ADMIN-05       Create, edit and   Source           
                                delete events      implementation   
                                                   PASS; runtime    
                                                   NOT RUN          

  \[ \]          ADMIN-06       Manage             Source           
                                administrators,    implementation   
                                roles and statuses PASS; runtime    
                                                   NOT RUN          

  \[ \]          ADMIN-07       Verify audit logs, NOT RUN          
                                notifications,                      
                                analytics and                       
                                settings                            

  \[ \]          ADMIN-08       Verify admin       NOT RUN          
                                endpoints reject                    
                                normal-user tokens                  
  --------------------------------------------------------------------------------

# 5. UI/UX, design system and accessibility

The design audit recommends preserving the existing editorial identity
rather than redesigning it.

  ------------------------------------------------------------------------------
  Done           ID             Checklist item     Initial status Evidence /
                                                                  notes
  -------------- -------------- ------------------ -------------- --------------
  \[x\]          UX-01          Warm ivory,        PASS ---       
                                charcoal and       design audit   
                                terracotta design                 
                                identity                          
                                documented                        

  \[x\]          UX-02          Playfair Display   PASS ---       
                                headings and Inter design audit   
                                body typography                   
                                documented                        

  \[x\]          UX-03          CSS variables are  PASS ---       
                                the design-token   design audit   
                                source of truth                   

  \[x\]          UX-04          Shared button,     PASS ---       
                                input, card, badge design audit   
                                and chip                          
                                primitives exist                  

  \[x\]          UX-05          Light, dark and    PASS ---       
                                system theme       source audit   
                                support exists                    

  \[ \]          UX-06          Verify every       NOT RUN        
                                important page in                 
                                light and dark                    
                                themes in a                       
                                browser                           

  \[ \]          UX-07          Verify loading,    Static         
                                error-with-retry   inspection     
                                and empty states   reported       
                                on all data views  present;       
                                                   runtime NOT    
                                                   RUN            

  \[ \]          UX-08          Verify keyboard    Static         
                                navigation and     inspection     
                                visible focus      reported       
                                states             present;       
                                                   runtime NOT    
                                                   RUN            

  \[ \]          UX-09          Verify accessible  Static         
                                labels and         inspection     
                                screen-reader      reported       
                                status/error       present;       
                                announcements      runtime NOT    
                                                   RUN            

  \[ \]          UX-10          Verify             Static         
                                reduced-motion     inspection     
                                behavior           reported       
                                                   present;       
                                                   runtime NOT    
                                                   RUN            

  \[ \]          UX-11          Review feed,       NOT RUN        
                                discovery,                        
                                settings and admin                
                                table usability in                
                                browser                           

  \[ \]          UX-12          Decide whether     OPEN / LOW     
                                skeleton loaders                  
                                are needed;                       
                                spinner-only state                
                                was accepted as a                 
                                future improvement                

  \[ \]          UX-13          Keep contact page  ACCEPTED       
                                `mailto:` fallback limitation     
                                unless a real                     
                                authorized backend                
                                contact endpoint                  
                                is implemented                    
  ------------------------------------------------------------------------------

# 6. Responsive testing

**Required viewport sizes:** 375×812, 390×844, 768×1024, 1366×768 and
1920×1080. Static responsiveness inspection is not runtime proof.

  ----------------------------------------------------------------------------
  Done           ID             Checklist item   Initial status Evidence /
                                                                notes
  -------------- -------------- ---------------- -------------- --------------
  \[ \]          RESP-01        Landing page at  NOT RUN        
                                all five                        
                                viewports                       

  \[ \]          RESP-02        Login,           NOT RUN        
                                registration and                
                                password pages                  
                                at all five                     
                                viewports                       

  \[ \]          RESP-03        User home,       NOT RUN        
                                discovery,                      
                                communities and                 
                                feed at all five                
                                viewports                       

  \[ \]          RESP-04        Messaging        NOT RUN        
                                single-pane                     
                                behavior at                     
                                mobile widths                   

  \[ \]          RESP-05        Notifications,   NOT RUN        
                                profile and                     
                                settings at all                 
                                five viewports                  

  \[ \]          RESP-06        Admin dashboard, NOT RUN        
                                users,                          
                                communities and                 
                                events at all                   
                                five viewports                  

  \[ \]          RESP-07        Admin tables     NOT RUN        
                                remain usable                   
                                with horizontal                 
                                scrolling where                 
                                necessary                       

  \[ \]          RESP-08        Mobile           Source fix     
                                user/admin       PASS; runtime  
                                navigation       NOT RUN        
                                exposes all                     
                                required routes                 

  \[ \]          RESP-09        Check horizontal NOT RUN        
                                overflow,                       
                                clipped content                 
                                and overlapping                 
                                elements                        

  \[ \]          RESP-10        Check modal fit, NOT RUN        
                                form layout,                    
                                long text                       
                                wrapping and                    
                                touch targets                   

  \[ \]          RESP-11        Check chart      NOT RUN        
                                readability and                 
                                image scaling                   
  ----------------------------------------------------------------------------

# 7. Frontend unit tests, integration tests and build

  ------------------------------------------------------------------------------
  Done           ID             Checklist item     Initial source Evidence /
                                                   status         notes
  -------------- -------------- ------------------ -------------- --------------
  \[x\]          TEST-01        Vitest + React     PASS ---       
                                Testing Library +  source audit   
                                jsdom                             
                                infrastructure                    
                                exists                            

  \[x\]          TEST-02        API helper tests   PASS ---       
                                cover unwrap,      26-test run    
                                normalizePage and  included these 
                                errorMessage                      

  \[x\]          TEST-03        State component    PASS ---       
                                tests cover        26-test run    
                                loading,           included these 
                                error/retry and                   
                                empty states                      

  \[x\]          TEST-04        Route guard tests  PASS ---       
                                exist              26-test run    
                                                   included these 

  \[x\]          TEST-05        ThemeContext tests PASS ---       
                                exist              26-test run    
                                                   included these 

  \[x\]          TEST-06        Auth page          PASS ---       
                                validation tests   26-test run    
                                exist, including   included these 
                                reset-password                    
                                regression                        

  \[ \]          TEST-07        Re-run             Previously     
                                `npm run build` on PASS; re-run   
                                current source     required       

  \[ \]          TEST-08        Re-run             Previously     
                                `npx vitest run`   26/26 PASS;    
                                on current source  re-run         
                                and confirm all    required       
                                tests pass                        

  \[ \]          TEST-09        Add or verify      Coverage to    
                                component tests    inspect        
                                for PostCard                      
                                comments,                         
                                reactions, editing                
                                and reporting                     

  \[ \]          TEST-10        Add or verify      Coverage to    
                                tests for          inspect        
                                onboarding                        
                                language                          
                                persistence and                   
                                settings editors                  

  \[ \]          TEST-11        Add or verify      Pending F-01   
                                tests for navbar                  
                                unread badges when                
                                implemented                       
  ------------------------------------------------------------------------------

# 8. Playwright end-to-end testing

Playwright infrastructure and 10 initial specs were reported as present.
Browser installation and spec execution were NOT RUN in the audit.

  -----------------------------------------------------------------------------------------------
  Done           ID             Checklist item                      Initial status Evidence /
                                                                                   notes
  -------------- -------------- ----------------------------------- -------------- --------------
  \[x\]          E2E-01         Playwright dependency and           PASS ---       
                                configuration exist                 source audit   

  \[x\]          E2E-02         Initial E2E specs exist for         PASS ---       
                                landing, 404, login, logout, forgot source audit   
                                password and admin protection/login                

  \[ \]          E2E-03         Install Chromium with               NOT RUN        
                                `npx playwright install chromium`                  

  \[ \]          E2E-04         Start frontend and backend and      NOT RUN        
                                verify both are reachable                          

  \[ \]          E2E-05         Configure dedicated test-user and   NOT RUN        
                                admin credentials through                          
                                environment variables                              

  \[ \]          E2E-06         Execute existing suite using        NOT RUN        
                                `npm run test:e2e`                                 

  \[ \]          E2E-07         Add and run registration, duplicate NOT SPECCED /  
                                email and email verification        NOT RUN        
                                journeys                                           

  \[ \]          E2E-08         Add and run full password reset     PARTIAL        
                                journey                             coverage / NOT 
                                                                    RUN            

  \[ \]          E2E-09         Add and run onboarding, profile and NOT SPECCED /  
                                discovery journeys                  NOT RUN        

  \[ \]          E2E-10         Add and run communities, feed,      NOT SPECCED /  
                                comments, uploads and connections   NOT RUN        
                                journeys                                           

  \[ \]          E2E-11         Add and run messaging and           NOT SPECCED /  
                                notification journeys               NOT RUN        

  \[ \]          E2E-12         Add and run event registration      NOT SPECCED /  
                                journey                             NOT RUN        

  \[ \]          E2E-13         Add and run admin user, community,  NOT SPECCED /  
                                event, moderation and administrator NOT RUN        
                                workflows                                          

  \[ \]          E2E-14         Capture and fix browser console     NOT RUN        
                                errors and failed network requests                 
  -----------------------------------------------------------------------------------------------

# 9. Database, Docker and environment

The database report records a successful PostGIS setup and 18 Flyway
migrations. Current Docker state must be rechecked because later
terminal observations may differ.

  --------------------------------------------------------------------------------------------
  Done           ID             Checklist item       Initial source Evidence / notes
                                                     status         
  -------------- -------------- -------------------- -------------- --------------------------
  \[x\]          DB-01          PostGIS Docker image PASS ---       `postgis/postgis:16-3.4`
                                and configuration    environment    
                                were established     report         

  \[x\]          DB-02          Persistent volume    PASS ---       `mcp-pgdata`
                                was configured       environment    
                                                     report         

  \[x\]          DB-03          Flyway V1--V18 were  PASS ---       
                                successfully applied environment    
                                in the reported      report         
                                environment                         

  \[x\]          DB-04          Backend started on   PASS ---       
                                port 8080 with       environment    
                                `/api` context in    report         
                                the reported                        
                                environment                         

  \[ \]          DB-05          Recheck Docker       NOT RUN in     
                                daemon and           current        
                                `docker ps -a`       session        

  \[ \]          DB-06          Inspect existing     NOT RUN in     Never delete volumes
                                volumes before any   current        
                                container/database   session        
                                action                              

  \[ \]          DB-07          Verify PostgreSQL    NOT RUN in     
                                readiness and        current        
                                PostGIS extension    session        

  \[ \]          DB-08          Verify Flyway        NOT RUN in     
                                migration state and  current        
                                Hibernate schema     session        
                                validation                          

  \[ \]          DB-09          Verify backend and   NOT RUN        
                                frontend can run                    
                                simultaneously                      

  \[ \]          DB-10          Verify development,  NOT RUN        
                                test and production                 
                                profiles remain                     
                                separated                           

  \[ \]          DB-11          Verify backup and    NOT RUN        
                                restore procedure                   
                                for persistent                      
                                database data                       
  --------------------------------------------------------------------------------------------

# 10. Runtime security and dependency checks

Static security checks were partly PASS. Most runtime
attack/authorization checks remain NOT RUN.

  ---------------------------------------------------------------------------------------
  Done           ID             Checklist item              Initial status Evidence /
                                                                           notes
  -------------- -------------- --------------------------- -------------- --------------
  \[x\]          SEC-01         No                          PASS ---       
                                `dangerouslySetInnerHTML`   static audit   
                                found in frontend source                   

  \[x\]          SEC-02         No frontend secrets found;  PASS ---       
                                public Google client ID     static audit   
                                distinguished from secrets                 

  \[x\]          SEC-03         Backend JWT authentication  PASS ---       
                                and admin authorization     static audit   
                                rules inspected                            

  \[x\]          SEC-04         Upload image type sniffing, PASS ---       
                                UUID filenames and path     static audit   
                                traversal protections                      
                                inspected                                  

  \[x\]          SEC-05         Rate-limit filter and login PASS ---       
                                lockout mechanisms found in static audit   
                                source                                     

  \[x\]          SEC-06         localStorage Bearer-token   ACCEPTED       Revisit if
                                trade-off documented        limitation     backend adds
                                                                           secure cookie
                                                                           support

  \[ \]          SEC-07         Test missing JWT returns    NOT RUN        
                                unauthorized response                      

  \[ \]          SEC-08         Test invalid JWT returns    NOT RUN        
                                unauthorized response                      

  \[ \]          SEC-09         Test expired JWT and        NOT RUN        
                                refresh behavior                           

  \[ \]          SEC-10         Test refresh-token rotation NOT RUN        
                                and reuse behavior                         

  \[ \]          SEC-11         Test normal user token      NOT RUN        
                                against admin endpoint                     
                                returns forbidden                          

  \[ \]          SEC-12         Test CORS preflight and     NOT RUN        
                                disallowed origin behavior                 

  \[ \]          SEC-13         Test rate limiting and      NOT RUN        
                                login lockout                              

  \[ \]          SEC-14         Test unauthenticated upload NOT RUN        
                                is rejected                                

  \[ \]          SEC-15         Test oversized, executable, NOT RUN        
                                SVG and MIME-mismatched                    
                                uploads are rejected                       

  \[ \]          SEC-16         Test public image retrieval Static scope   
                                is limited to intended      inspected;     
                                image resources             runtime NOT    
                                                            RUN            

  \[ \]          SEC-17         Run `npm audit` and review  NOT RUN        
                                vulnerabilities                            

  \[ \]          SEC-18         Run Maven OWASP             NOT RUN        
                                Dependency-Check and review                
                                vulnerabilities                            

  \[ \]          SEC-19         Confirm secrets are not     NOT RUN        
                                committed, logged or                       
                                exposed in build artifacts                 
  ---------------------------------------------------------------------------------------

# 11. Remaining product features and technical debt

These are the open items identified in the final source-of-truth audit.
Decide whether to implement, explicitly accept, or defer each item. Do
not silently treat an optional feature as completed.

  -----------------------------------------------------------------------------------------------
  Done           ID             Checklist item              Initial status    Priority / decision
  -------------- -------------- --------------------------- ----------------- -------------------
  \[ \]          F-01           Add navbar unread-message   NOT IMPLEMENTED   P1 --- implement
                                and unread-notification                       
                                badges using existing count                   
                                APIs                                          

  \[ \]          F-02           Decide whether to add an    NOT IMPLEMENTED   Optional
                                unread-only notifications                     
                                filter                                        

  \[ \]          F-03           Remove duplicate unused     Unused/dead code  P3 --- cleanup
                                `userService.me` or wire it                   
                                intentionally                                 

  \[ \]          F-04           Decide whether nearby       Future feature    Defer unless
                                discovery using                               required
                                `locationService.nearby` is                   
                                in launch scope                               

  \[ \]          F-05           Decide whether              Unused/optional   P3
                                `connectionService.check`                     
                                is needed as a pre-check                      
                                optimization                                  

  \[ \]          F-06           Decide whether to add a My  Unused/optional   P3
                                Posts profile tab using                       
                                `postService.mine`                            

  \[ \]          F-07           Verify location update      PARTIAL           P2 --- verify
                                payload and use dedicated                     
                                location endpoint if                          
                                required                                      

  \[ \]          F-08           Decide whether unused admin PARTIAL / low     Retain unless user
                                detail endpoints need UI    value             need exists

  \[ \]          F-09           Decide whether to build a   NOT IMPLEMENTED   Backend-dependent
                                real contact form backend                     
                                endpoint with authorization                   

  \[ \]          F-10           Decide whether to implement NOT IMPLEMENTED   Optional scale work
                                authenticated WebSocket                       
                                messaging/push                                
                                notifications                                 

  \[x\]          F-11           Remove duplicated           PASS --- source   
                                `asArray()` helper and      verified          
                                centralize it                                 

  \[x\]          F-12           Community feed deep link    PASS --- source   
                                preselects community filter verified          

  \[x\]          F-13           Mobile user/admin           PASS --- source   
                                navigation chip strips are  verified          
                                implemented                                   

  \[x\]          F-14           Unit test infrastructure    PASS --- previous Re-run required
                                and 26 passing tests were   execution         
                                reported                                      

  \[ \]          F-15           Decide whether to retain    ACCEPTED in audit Document decision;
                                10--15 second messaging                       no change required
                                polling for launch                            unless needed

  \[ \]          F-16           Decide whether localStorage ACCEPTED in audit Document trade-off;
                                JWT storage remains                           backend changes
                                acceptable for launch                         required for cookie
                                                                              alternative
  -----------------------------------------------------------------------------------------------

# 12. Performance, maintainability and release checks

  ---------------------------------------------------------------------------
  Done           ID             Checklist item  Initial status Evidence /
                                                               notes
  -------------- -------------- --------------- -------------- --------------
  \[x\]          PERF-01        Admin routes    PASS ---       
                                are lazy-loaded source audit   
                                and Recharts is                
                                split into a                   
                                lazy chunk                     

  \[ \]          PERF-02        Re-run          NOT RUN        
                                production                     
                                build and                      
                                inspect                        
                                bundle-size                    
                                warnings                       

  \[ \]          PERF-03        Verify images   NOT RUN        
                                are optimized                  
                                and loading                    
                                behavior is                    
                                acceptable                     

  \[ \]          PERF-04        Check           NOT RUN        
                                unnecessary                    
                                repeated API                   
                                calls and                      
                                polling cleanup                

  \[ \]          PERF-05        Check React     NOT RUN        
                                console                        
                                warnings and                   
                                unhandled                      
                                promise errors                 

  \[ \]          REL-01         All critical    NOT RUN        
                                live API                       
                                workflows pass                 

  \[ \]          REL-02         All required    NOT RUN        
                                Playwright E2E                 
                                journeys pass                  

  \[ \]          REL-03         Required        NOT RUN        
                                responsive                     
                                viewport checks                
                                pass                           

  \[ \]          REL-04         Required        NOT RUN        
                                runtime                        
                                security checks                
                                pass                           

  \[ \]          REL-05         Frontend build  Previously     
                                and unit tests  PASS; re-run   
                                pass on final   required       
                                source                         

  \[ \]          REL-06         Backend compile Previously     
                                and tests pass  compile PASS;  
                                on final source full test      
                                                status to      
                                                verify         

  \[ \]          REL-07         Database        Previously     
                                migrations and  PASS; re-run   
                                persistence are required       
                                verified                       

  \[ \]          REL-08         No critical or  NOT VERIFIED   
                                high-severity                  
                                unresolved                     
                                defects remain                 

  \[ \]          REL-09         Production      NOT RUN        
                                environment                    
                                variables and                  
                                secrets are                    
                                correctly                      
                                configured                     

  \[ \]          REL-10         Final release   NOT RUN        
                                decision is                    
                                recorded as                    
                                READY FOR                      
                                STAGING, READY                 
                                FOR PRODUCTION                 
                                or NOT READY                   
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

# 13. Execution log

Append a short entry here whenever a meaningful batch of work is
completed. Keep it factual.

  ----------------------------------------------------------------------------
  Date         Phase / IDs Work performed Tests /     Result      Remaining
                                          evidence                blockers
  ------------ ----------- -------------- ----------- ----------- ------------
  2026-11-16   Baseline    Consolidated   See         Baseline    Live API,
               audits      source audit   original    recorded    E2E,
               01--23      and            audit                   responsive
                           verification   evidence                runtime and
                           reports        before                  runtime
                                          retiring                security
                                          files                   checks
                                                                  pending

  ----------------------------------------------------------------------------

------------------------------------------------------------------------

# 14. Final release sign-off

Complete this section only after the relevant checklist items have
evidence.

-   [ ] All P0 live API verification completed.
-   [ ] All critical user and admin workflows verified.
-   [ ] Required Playwright E2E suite passes.
-   [ ] Responsive runtime checks pass at all required viewports.
-   [ ] Runtime security checks completed.
-   [ ] Dependency vulnerability review completed.
-   [ ] Database persistence and recovery approach verified.
-   [ ] No unresolved critical/high defects.
-   [ ] Known accepted limitations documented above.
-   [ ] Final release decision approved.

**Final decision:** NOT READY / READY FOR STAGING / READY FOR PRODUCTION

**Decision date:**\
**Verified by:**\
**Outstanding blockers:**

------------------------------------------------------------------------

## Maintenance rule

This file replaces the 23 separate audit/progress files as the ongoing
task tracker. Keep the original evidence in Git history or another
archive until this checklist has been reviewed and the team is confident
that no required task or evidence has been lost. Do not delete the
source reports before confirming that this consolidated checklist covers
them and that the important findings have been retained.
